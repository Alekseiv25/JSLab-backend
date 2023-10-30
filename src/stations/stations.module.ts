import { Module } from '@nestjs/common';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Station } from './stations.model';
import { StationAccount } from 'src/accounts/accounts.model';

@Module({
  controllers: [StationsController],
  providers: [StationsService],
  imports: [SequelizeModule.forFeature([Station, StationAccount])],
})
export class StationsModule {}
