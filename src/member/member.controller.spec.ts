import {ConfigModule} from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Test, TestingModule } from '@nestjs/testing';
import { join } from 'path';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { DatabaseModule } from '../database/database.module';
import { RepositoryModule } from '../repository/repository.module';
import { TeamController } from '../team/team.controller';
import { UsersModule } from '../users/users.module';
import { MemberController } from './member.controller';

describe('MemberController', () => {
  let controller: MemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        EventEmitterModule.forRoot(),
        ServeStaticModule.forRoot({
          rootPath: join(__dirname, '..', 'frontend/dist'),
          exclude: ['/api/(.*)'],
        }),
        AuthModule,
        UsersModule,
        DatabaseModule,
        RepositoryModule,
        CommonModule,
      ],
      controllers: [AppController, TeamController, MemberController],
      providers: [AppService],
    }).compile();

    controller = module.get<MemberController>(MemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
