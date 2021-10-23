import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { DeepPartial, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppLogger } from '../common/logger';
import { Member } from '../domain/member';
import { Role } from '../domain/role';
import { Team } from '../domain/team';
import { TeamMemberRole } from '../domain/team-member-role';

export class CreateTeamDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
}

interface ListAllTeamDetails {
  team_id: string;
  name: string;
  description: string;
  tech_lead: string;
  created: Date;
  updated: Date;
}

@ApiBearerAuth()
@ApiTags('team')
@Controller('/api/team')
export class TeamController {
  constructor(
    @Inject('ROLE_REPOSITORY') private roleRespository: Repository<Role>,
    @Inject('MEMBER_REPOSITORY') private memberRepository: Repository<Member>,
    @Inject('TEAM_REPOSITORY') private teamRepository: Repository<Team>,
    @Inject('TEAM_MEMBER_ROLE_REPOSITORY')
    private teamMemberRoleRepository: Repository<TeamMemberRole>,
    private logger: AppLogger,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list() {
    try {
      const teams = await this.teamRepository
        .createQueryBuilder('t')
        .leftJoinAndSelect('t.teamMemberRoles', 'tmr')
        .leftJoinAndSelect('tmr.member', 'm')
        .leftJoinAndSelect('tmr.role', 'r')
        .where("r.id = 'TL' OR r.id IS NULL")
        .getMany();

      const allTeamDetails: ListAllTeamDetails[] = teams.map(
        (t) =>
          <ListAllTeamDetails>{
            team_id: t.teamId,
            name: t.name,
            description: t.description,
            tech_lead:
              t.teamMemberRoles.map((tmr) => tmr.member.name).join(',') || '-',
            created: t.created,
            updated: t.updated,
          },
      );

      return allTeamDetails;
    } catch (err) {
      this.logger.error(err);
      const errorString = JSON.stringify(err, Object.getOwnPropertyNames(err));
      throw new InternalServerErrorException(errorString);
    }
  }

  @ApiBody({ type: CreateTeamDTO })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() request: any, @Body() body: DeepPartial<Team>) {
    try {
      const team = await this.teamRepository.save(body);
      const role = await this.roleRespository.findOne('TL');
      if (!role) {
        throw new NotFoundException();
      }

      let member = await this.memberRepository.findOne({
        email: request.user.username, // The current user is set as the default tech lead
      });

      if (!member) {
        member = new Member();
        member.email = request.user.username;
        member.name = body.name;
        member = await this.memberRepository.save(member);
      }

      let teamMemberRole = await this.teamMemberRoleRepository.findOne({
        member,
        team,
        role,
      });

      if (!teamMemberRole) {
        teamMemberRole = new TeamMemberRole();
        teamMemberRole.member = member;
        teamMemberRole.team = team;
        teamMemberRole.role = role;
        teamMemberRole = await this.teamMemberRoleRepository.save(
          teamMemberRole,
        );
      }
      return team;
    } catch (err) {
      this.logger.error(err);
      const errorString = JSON.stringify(err, Object.getOwnPropertyNames(err));
      throw new InternalServerErrorException(errorString);
    }
  }

  @ApiBody({ type: CreateTeamDTO })
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: QueryDeepPartialEntity<Team>,
  ) {
    return this.teamRepository.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    return this.teamRepository.softDelete(id);
  }
}
