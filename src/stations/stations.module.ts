import { Module } from '@nestjs/common';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Station } from './stations.model';
import { StationAccount } from 'src/accounts/accounts.model';
import { TokensModule } from 'src/tokens/tokens.module';
import { OperationsService } from 'src/operations/operations.service';
import { Operation } from 'src/operations/operations.model';
import { Transaction } from 'src/transactions/transactions.model';

@Module({
  controllers: [StationsController],
  providers: [StationsService, OperationsService],
  imports: [
    SequelizeModule.forFeature([Station, StationAccount, Operation, Transaction]),
    TokensModule,
  ],
})
export class StationsModule {}
