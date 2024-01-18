import { UsersStationsService } from './users_stations.service';
import { UsersStations } from './users_stations.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';

@Module({
  imports: [SequelizeModule.forFeature([UsersStations])],
  providers: [UsersStationsService],
  exports: [UsersStationsService],
})
export class UsersStationsModule {}
