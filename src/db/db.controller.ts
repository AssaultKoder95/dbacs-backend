import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { DeepPartial, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppLogger } from '../common/logger';
import { Database } from '../domain/database';
import { DatabaseCredential } from '../domain/database-credential';
import { Team } from '../domain/team';
import { TeamDb } from '../domain/team-db';
import { TeamMemberRole } from '../domain/team-member-role';

export class CreateDbDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  connection_string: string;
  @ApiProperty()
  status: string;
  @ApiProperty()
  cluster_id: string;
  @ApiProperty()
  platform: string;
  @ApiProperty()
  environment: string;
  @ApiProperty()
  mode: string;
  @ApiProperty()
  created: Date;
  @ApiProperty()
  updated: Date;
}

interface ListDbDTO {
  id: string;
  name: string;
  description: string;
  connection_string: string;
  status: string;
  platform: string;
  environment: string;
  mode: string;
  created: Date;
  updated: Date;
  deleted: Date;
  teams: [TeamDTO];
}

interface TeamDTO {
  team_id: string;
  name: string;
  members: [MemberDTO];
}

interface MemberDTO {
  id: string;
  name: string;
  email: string;
  role: string;
}
@ApiBearerAuth()
@ApiTags('db')
@Controller('/api/db')
export class DbController {
  constructor(
    @Inject('DB_REPOSITORY') private dbRespository: Repository<Database>,
    @Inject('TEAM_REPOSITORY') private teamRepository: Repository<Team>,
    @Inject('TEAM_DB_REPOSITORY')
    private teamDbRepository: Repository<TeamDb>,
    @Inject('TEAM_MEMBER_ROLE_REPOSITORY')
    private teamMemberRoleRepository: Repository<TeamMemberRole>,
    @Inject('DB_CREDENTIAL_REPOSITORY')
    private dbCredentialRepository: Repository<DatabaseCredential>,
    private logger: AppLogger,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Request() req) {
    try {
      const base = this.dbRespository
        .createQueryBuilder('d')
        .leftJoinAndSelect('d.teamDbs', 'td')
        .leftJoinAndSelect('td.team', 't')
        .leftJoinAndSelect('t.teamMemberRoles', 'tmr')
        .leftJoinAndSelect('tmr.member', 'm')
        .leftJoinAndSelect('tmr.role', 'r');
      let dbs = [];
      if (req.user.permissions.some((p) => p.roleId === 'ADMIN')) {
        dbs = await base.getMany();
      } else {
        if (req.user.permissions.length == 0) {
          // user has no team, return empty results
          return [];
        }

        dbs = await base
          .where('t.teamId IN (:...teams)', {
            teams: req.user.permissions.map((p) => p.teamId),
          })
          .getMany();
      }
      const dtos: ListDbDTO[] = dbs.map(
        (db) =>
          <ListDbDTO>{
            id: db.id,
            name: db.name,
            description: db.description,
            connection_string: db.connectionString,
            status: db.status,
            platform: db.platform,
            environment: db.environment,
            mode: db.mode,
            created: db.created,
            updated: db.updated,
            deleted: db.deleted,
            teams: db.teamDbs.map(
              (td) =>
                <TeamDTO>{
                  team_id: td.team.teamId,
                  name: td.team.name,
                  members: td.team.teamMemberRoles.map(
                    (tmr) =>
                      <MemberDTO>{
                        id: tmr.member.id,
                        name: tmr.member.name,
                        email: tmr.member.email,
                        role: tmr.role.id,
                      },
                  ),
                },
            ),
          },
      );

      return dtos;
    } catch (err) {
      this.logger.error(err);
      const errorString = JSON.stringify(err, Object.getOwnPropertyNames(err));
      throw new InternalServerErrorException(errorString);
    }
  }

  @ApiBody({ type: CreateDbDTO })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() body: DeepPartial<Database>) {
    try {
      const result = await this.dbRespository.save(body);
      const teams: Team[] = await Promise.all(
        req.user.permissions
          .filter((p) => p.roleId === 'ADMIN' || p.roleId === 'TL')
          .map((p) => p.teamId)
          .map(async (teamId) => this.teamRepository.findOne({ teamId })),
      );
      await Promise.all(
        teams.map(async (t) => {
          const teamDb = new TeamDb();
          teamDb.database = result;
          teamDb.team = t;
          return this.teamDbRepository.save(teamDb);
        }),
      );
      const db = await this.dbRespository
        .createQueryBuilder('d')
        .leftJoinAndSelect('d.cluster', 'c')
        .where('d.id = :id', { id: result.id })
        .getOneOrFail();
      const teamMemberRoles = await this.teamMemberRoleRepository
        .createQueryBuilder('tmr')
        .leftJoinAndSelect('tmr.member', 'm')
        .leftJoinAndSelect('tmr.role', 'r')
        .leftJoinAndSelect('tmr.team', 't')
        .where('t.teamId IN (:...teams)', {
          teams: req.user.permissions.map((p) => p.teamId),
        })
        .getMany();
      await Promise.all(
        teamMemberRoles.map(async (tmr) => {
          const newCredential = new DatabaseCredential();
          newCredential.database = db;
          newCredential.creator = tmr;
          newCredential.connectionString = db.connectionString;
          newCredential.name = 'Initial Read-Only Access';
          newCredential.purpose =
            'All new databases have read-only access for all the member of their team';
          newCredential.status = 'pending';
          newCredential.accessLevel = 'ro';
          // Isaac Newton predicted the world will have end by 2060 ;)
          newCredential.expiration = new Date('2060-01-01');
          newCredential.username = `${
            tmr.member.email.match(/^([^@]*)@/)[1]
          }_${newCredential.expiration?.getTime()}_${
            newCredential.accessLevel
          }`;
          return this.dbCredentialRepository.save(newCredential);
        }),
      );
      return result;
    } catch (err) {
      this.logger.error(err);
      const errorString = JSON.stringify(err, Object.getOwnPropertyNames(err));
      throw new InternalServerErrorException(errorString);
    }
  }

  @ApiBody({ type: CreateDbDTO })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: QueryDeepPartialEntity<Database>,
    @Request() req,
  ) {
    if (!req.user.permissions.some((p) => p.roleId === 'ADMIN')) {
      throw new UnauthorizedException(
        'You can only do this if you are an adminstrator',
      );
    }
    const result = await this.dbRespository.update(id, body);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async softDelete(@Param('id') id: string, @Request() req) {
    if (!req.user.permissions.some((p) => p.roleId === 'ADMIN')) {
      throw new UnauthorizedException(
        'You can only do this if you are an adminstrator',
      );
    }
    const result = await this.dbRespository.softDelete(id);
    return result;
  }
}
