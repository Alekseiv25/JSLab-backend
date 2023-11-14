import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account, StationAccount } from './accounts.model';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [SequelizeModule.forFeature([Account, StationAccount]), TokensModule],
})
export class AccountsModule {}
