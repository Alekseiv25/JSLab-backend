import { Module } from '@nestjs/common';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Station } from './stations.model';
import { StationAccount } from '../accounts/accounts.model';
import { TokensModule } from '../tokens/tokens.module';
import { OperationsService } from '../operations/operations.service';
import { Operation } from '../operations/operations.model';
import { Transaction } from '../transactions/transactions.model';
import { UsersModule } from '../users/users.module';
import { UsersStationsModule } from '../users_stations/users_stations.module';

@Module({
  controllers: [StationsController],
  providers: [StationsService, OperationsService],
  imports: [
    SequelizeModule.forFeature([Station, StationAccount, Operation, Transaction]),
    UsersModule,
    TokensModule,
    UsersStationsModule,
  ],
  exports: [StationsService],
})
export class StationsModule {}
