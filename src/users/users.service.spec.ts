import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'typeorm';
import { CommonModule } from '../common/common.module';
import { databaseProviders } from '../database/database.providers';
import { Member } from '../domain/member';
import { RepositoryModule } from '../repository/repository.module';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        EventEmitterModule.forRoot(),
        RepositoryModule,
        ConfigModule.forRoot(),
        CommonModule,
      ],
      providers: [
        UsersService,
        {
          provide: 'MEMBER_REPOSITORY',
          useFactory: (connection: Connection) =>
            connection.getRepository(Member),
          inject: ['DATABASE_CONNECTION'],
        },
        databaseProviders[0],
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
