import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersParams } from './users_params.model';
import { UsersParamsService } from './users_params.service';
import { User } from 'src/users/users.model';

@Module({
  imports: [SequelizeModule.forFeature([UsersParams, User])],
  providers: [UsersParamsService],
  exports: [UsersParamsService],
})
export class UsersParamsModule {}
