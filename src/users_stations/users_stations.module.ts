import { UsersStationsService } from './users_stations.service';
import { UsersStations } from './users_stations.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { Module } from '@nestjs/common';

@Module({
  imports: [SequelizeModule.forFeature([UsersStations, User])],
  providers: [UsersStationsService],
  exports: [UsersStationsService],
})
export class UsersStationsModule {}
