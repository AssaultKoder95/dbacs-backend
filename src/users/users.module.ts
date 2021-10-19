import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { RepositoryModule } from '../repository/repository.module';
import { UsersService } from './users.service';

@Module({
  imports: [RepositoryModule, CommonModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
