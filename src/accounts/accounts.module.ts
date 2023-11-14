import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account, StationAccount } from './accounts.model';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { StationsService } from 'src/stations/stations.service';
import { Station } from 'src/stations/stations.model';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, StationsService],
  imports: [SequelizeModule.forFeature([Account, StationAccount, Station])],
})
export class AccountsModule {}
