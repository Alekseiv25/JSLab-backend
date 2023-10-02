import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Account } from './accounts.model';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService],
  imports: [SequelizeModule.forFeature([Account])],
})
export class AccountsModule {}
