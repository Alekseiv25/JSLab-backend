import { Module } from '@nestjs/common';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Station } from './stations.model';

@Module({
  controllers: [StationsController],
  providers: [StationsService],
  imports: [SequelizeModule.forFeature([Station])],
})
export class StationsModule {}
