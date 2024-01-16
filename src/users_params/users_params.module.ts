import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersParams } from './users_params.model';
import { UsersParamsService } from './users_params.service';

@Module({
  imports: [SequelizeModule.forFeature([UsersParams])],
  providers: [UsersParamsService],
  exports: [UsersParamsService],
})
export class UsersParamsModule {}
