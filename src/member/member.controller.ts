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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppLogger } from '../common/logger';
import { DatabaseCredential } from '../domain/database-credential';
import { Member } from '../domain/member';
import { Role } from '../domain/role';
import { Team } from '../domain/team';
import { TeamDb } from '../domain/team-db';
import { TeamMemberRole } from '../domain/team-member-role';

export class CreateTeamMemberDTO {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  role: string;
}

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
    @Inject('DB_CREDENTIAL_REPOSITORY')
    private dbCredentialRepository: Repository<DatabaseCredential>,
    @Inject('TEAM_DB_REPOSITORY')
    private teamDbRepository: Repository<TeamDb>,
    private logger: AppLogger,
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

  @UseGuards(JwtAuthGuard)
  @Get('search/:searchParam')
  async typeahead(@Param('searchParam') typeahead: string) {
    try {
      const members: Member[] = await this.memberRepository
        .createQueryBuilder('m')
        .where('similarity(m.name, :searchParam) >= 0.11', { typeahead })
        .orWhere('similarity(m.email, :searchParam) >= 0.11', { typeahead })
        .addSelect(
          `similarity(m.name, '${typeahead}') + similarity(m.email, '${typeahead}') AS score`,
        )
        .orderBy('score', 'DESC')
        .getMany();

      const dtos = members.map(
        (m) =>
          <ListTeamMemberDTO>{
            id: m.id,
            member_id: m.id,
            username: m.username,
            name: m.name,
            email: m.email,
          },
      );

      return dtos;
    } catch (err) {
      this.logger.error(err);
      const errorString = JSON.stringify(err, Object.getOwnPropertyNames(err));
      throw new InternalServerErrorException(errorString);
    }
  }

  @ApiBody({ type: [CreateTeamMemberDTO] })
  @UseGuards(JwtAuthGuard)
  @Post(':teamId')
  async addTeamMember(
    @Param('teamId') teamId: string,
    @Body() body: [CreateTeamMemberDTO],
  ) {
    const team = await this.teamRepository.findOne(teamId);
    if (!team) {
      throw new NotFoundException(`Team ${teamId} not found`);
    }

    const results = body.map(async (value: CreateTeamMemberDTO) => {
      const role = await this.roleRespository.findOne(value.role);
      if (!role) {
        return new NotFoundException(`Team ${value.role} not found`);
      }

      try {
        let member = await this.memberRepository.findOne({
          email: value.email,
        });

        if (!member) {
          member = new Member();
          member.email = value.email;
          member.name = value.name;
          member = await this.memberRepository.save(member);
        }

        let teamMemberRole = await this.teamMemberRoleRepository
          .createQueryBuilder('tmr')
          .leftJoinAndSelect('tmr.member', 'm')
          .leftJoinAndSelect('tmr.role', 'r')
          .leftJoinAndSelect('tmr.team', 't')
          .where('t.teamId = :teamId', { teamId: team.teamId })
          .andWhere('m.id = :member_id', { member_id: member.id })
          .andWhere('r.id = :role_id', { role_id: role.id })
          .getOne();

        if (!teamMemberRole) {
          teamMemberRole = new TeamMemberRole();
          teamMemberRole.member = member;
          teamMemberRole.team = team;
          teamMemberRole.role = role;
          teamMemberRole = await this.teamMemberRoleRepository.save(
            teamMemberRole,
          );
        }

        const listOfTeamDatabases = await this.teamDbRepository
          .createQueryBuilder('td')
          .leftJoinAndSelect('td.team', 't')
          .leftJoinAndSelect('td.database', 'd')
          .where('t.teamId = :teamId', { teamId: team.teamId })
          .getMany();

        const dbCredentials = listOfTeamDatabases.map(async (tdc) => {
          const oldCredential = await this.dbCredentialRepository
            .createQueryBuilder('dc')
            .innerJoinAndSelect('dc.database', 'd')
            .innerJoinAndSelect('dc.creator', 'tmr')
            .innerJoinAndSelect('tmr.member', 'm')
            .innerJoinAndSelect('tmr.role', 'r')
            .innerJoinAndSelect('tmr.team', 't')
            .where('t.teamId = :teamId', { teamId: team.teamId })
            .andWhere('m.id = :member_id', { member_id: member.id })
            .andWhere('r.id = :role_id', { role_id: role.id })
            .andWhere('d.id = :database_id', { database_id: tdc.database.id })
            .getOne();

          if (oldCredential) {
            return oldCredential;
          }

          const newCredential = new DatabaseCredential();
          newCredential.database = tdc.database;
          newCredential.creator = teamMemberRole;
          newCredential.connectionString = tdc.database.connectionString;
          newCredential.name = 'Initial Read-Only Access';
          newCredential.purpose =
            'All new members have read-only access to all the databases of their team';
          newCredential.status = 'pending';
          newCredential.accessLevel = 'ro';
          // Isaac Newton predicted the world will have end by 2060 ;)
          newCredential.expiration = new Date('2060-01-01');
          newCredential.username = `${
            teamMemberRole.member.email.match(/^([^@]*)@/)[1]
          }_${newCredential.expiration?.getTime()}_${
            newCredential.accessLevel
          }`;
          const newCredentialAfterSaving =
            await this.dbCredentialRepository.save(newCredential);
          return newCredentialAfterSaving;
        });

        await Promise.all(dbCredentials);

        return {
          id: teamMemberRole.id,
          member_id: teamMemberRole.member.id,
          team_id: teamMemberRole.team.teamId,
          role_id: teamMemberRole.role.id,
        };
      } catch (err) {
        this.logger.error(err);
        const errorString = JSON.stringify(
          err,
          Object.getOwnPropertyNames(err),
        );
        return new InternalServerErrorException(errorString);
      }
    });

    return Promise.all(results);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    return this.teamMemberRoleRepository.softDelete(id);
  }
}
