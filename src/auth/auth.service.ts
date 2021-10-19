import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { Repository } from 'typeorm';
import { AppLogger } from '../common/logger';
import { TeamMemberRole } from '../domain/team-member-role';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject('TEAM_MEMBER_ROLE_REPOSITORY')
    private teamMemberRoleRepository: Repository<TeamMemberRole>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private logger: AppLogger,
    private configService: ConfigService,
  ) {}

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async loginWithIdToken(idToken: string) {
    try {
      const client = new OAuth2Client({
        clientSecret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
        clientId: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const loginTicket = await client.verifyIdToken({
        idToken,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });

      const ticketPayload = loginTicket.getPayload();
      const userEmail = ticketPayload.email;

      const members: TeamMemberRole[] = await this.teamMemberRoleRepository
        .createQueryBuilder('tmr')
        .innerJoinAndSelect('tmr.member', 'm')
        .innerJoinAndSelect('tmr.team', 't')
        .innerJoinAndSelect('tmr.role', 'r')
        .where('m.email = :userEmail', { userEmail })
        .getMany();

      const listOfRoleAndTeams = members.map(({ role, team }) => ({
        teamId: team.teamId,
        roleId: role.id,
      }));

      const member = await this.usersService.findOneOrCreate(
        ticketPayload.email,
        ticketPayload.given_name,
        ticketPayload.family_name,
      );

      const payload = {
        username: loginTicket.getPayload().email,
        userId: member.id,
        sub: loginTicket.getUserId(),
        permissions: listOfRoleAndTeams,
      };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (err) {
      this.logger.error(err);
      const errorString = JSON.stringify(err, Object.getOwnPropertyNames(err));
      throw new InternalServerErrorException(errorString);
    }
  }
}
