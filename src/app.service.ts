import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { AppLogger } from './common/logger';
import { Database } from './domain/database';
import { Member } from './domain/member';
import { TeamMemberRole } from './domain/team-member-role';

@Injectable()
export class AppService {
  constructor(
    @Inject('DB_REPOSITORY')
    private dbRespository: Repository<Database>,
    @Inject('TEAM_MEMBER_ROLE_REPOSITORY')
    private teamMemberRoleRepository: Repository<TeamMemberRole>,
    @Inject('MEMBER_REPOSITORY') private memberRepository: Repository<Member>,
    private logger: AppLogger,
    private configService: ConfigService,
  ) {}
}
