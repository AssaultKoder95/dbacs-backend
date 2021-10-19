import {
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Repository } from 'typeorm';
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
}
