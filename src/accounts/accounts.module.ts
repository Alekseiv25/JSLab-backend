import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account, StationAccount } from './accounts.model';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TokensModule } from '../tokens/tokens.module';
import { StationsService } from '../stations/stations.service';
import { Station } from '../stations/stations.model';
import { OperationsService } from '../operations/operations.service';
import { Operation } from '../operations/operations.model';
import { UsersModule } from '../users/users.module';
import { UsersStationsModule } from '../users_stations/users_stations.module';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, StationsService, OperationsService],
  imports: [
    SequelizeModule.forFeature([Account, StationAccount, Station, Operation]),
    TokensModule,
    UsersModule,
    UsersStationsModule,
  ],
})
export class AccountsModule {}
