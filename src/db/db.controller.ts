import {
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppLogger } from '../common/logger';
import { Database } from '../domain/database';
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
    private logger: AppLogger,
    private eventEmitter: EventEmitter2,
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
}
