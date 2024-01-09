import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account, StationAccount } from './accounts.model';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TokensModule } from 'src/tokens/tokens.module';
import { StationsService } from 'src/stations/stations.service';
import { Station } from 'src/stations/stations.model';
import { OperationsService } from 'src/operations/operations.service';
import { Operation } from 'src/operations/operations.model';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, StationsService, OperationsService],
  imports: [
    SequelizeModule.forFeature([Account, StationAccount, Station, Operation]),
    TokensModule,
    UsersModule,
  ],
})
export class AccountsModule {}
