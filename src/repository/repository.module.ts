import { Module } from '@nestjs/common';
import { Connection } from 'typeorm';
import { CommonModule } from '../common/common.module';
import { DatabaseModule } from '../database/database.module';
import { Database } from '../domain/database';
import { Member } from '../domain/member';
import { Role } from '../domain/role';
import { Team } from '../domain/team';
import { TeamDb } from '../domain/team-db';
import { TeamMemberRole } from '../domain/team-member-role';
import { DatabaseCredential } from '../domain/database-credential';

@Module({
  imports: [DatabaseModule, CommonModule],
  providers: [
    {
      provide: 'MEMBER_REPOSITORY',
      useFactory: (connection: Connection) => connection.getRepository(Member),
      inject: ['DATABASE_CONNECTION'],
    },
    {
      provide: 'TEAM_REPOSITORY',
      useFactory: (connection: Connection) => connection.getRepository(Team),
      inject: ['DATABASE_CONNECTION'],
    },
    {
      provide: 'TEAM_MEMBER_ROLE_REPOSITORY',
      useFactory: (connection: Connection) =>
        connection.getRepository(TeamMemberRole),
      inject: ['DATABASE_CONNECTION'],
    },
    {
      provide: 'ROLE_REPOSITORY',
      useFactory: (connection: Connection) => connection.getRepository(Role),
      inject: ['DATABASE_CONNECTION'],
    },
    {
      provide: 'DB_REPOSITORY',
      useFactory: (connection: Connection) =>
        connection.getRepository(Database),
      inject: ['DATABASE_CONNECTION'],
    },
    {
      provide: 'TEAM_DB_REPOSITORY',
      useFactory: (connection: Connection) => connection.getRepository(TeamDb),
      inject: ['DATABASE_CONNECTION'],
    },
    {
      provide: 'DB_CREDENTIAL_REPOSITORY',
      useFactory: (connection: Connection) =>
        connection.getRepository(DatabaseCredential),
      inject: ['DATABASE_CONNECTION'],
    },
  ],
  exports: [
    'MEMBER_REPOSITORY',
    'TEAM_REPOSITORY',
    'TEAM_MEMBER_ROLE_REPOSITORY',
    'ROLE_REPOSITORY',
    'DB_REPOSITORY',
    'TEAM_DB_REPOSITORY',
    'DB_CREDENTIAL_REPOSITORY',
  ],
})
export class RepositoryModule {}
