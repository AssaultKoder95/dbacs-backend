import {
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppLogger } from '../common/logger';
import { Member } from '../domain/member';
import { Role } from '../domain/role';
import { Team } from '../domain/team';
import { TeamMemberRole } from '../domain/team-member-role';
import { UsersService } from '../users/users.service';

interface ListTeamMemberDTO {
  id: string;
  member_id: string;
  email: string;
  name: string;
}

@ApiBearerAuth()
@ApiTags('member')
@Controller('/api/member')
export class MemberController {
  constructor(
    @Inject('ROLE_REPOSITORY') private roleRespository: Repository<Role>,
    @Inject('MEMBER_REPOSITORY') private memberRepository: Repository<Member>,
    @Inject('TEAM_REPOSITORY') private teamRepository: Repository<Team>,
    @Inject('TEAM_MEMBER_ROLE_REPOSITORY')
    private teamMemberRoleRepository: Repository<TeamMemberRole>,
    @Inject('TEAM_DB_REPOSITORY')
    private logger: AppLogger,
    private usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':teamId')
  async list(@Param('teamId') teamId: string) {
    try {
      const members: TeamMemberRole[] = await this.teamMemberRoleRepository
        .createQueryBuilder('tmr')
        .innerJoinAndSelect('tmr.member', 'm')
        .innerJoinAndSelect('tmr.team', 't')
        .innerJoinAndSelect('tmr.role', 'r')
        .where('t.teamId = :teamId', { teamId })
        .getMany();

      const dtos = members.map(
        (m) =>
          <ListTeamMemberDTO>{
            id: m.id,
            member_id: m.member.id,
            username: m.member.username,
            name: m.member.name,
            email: m.member.email,
            role: m.role.id,
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
