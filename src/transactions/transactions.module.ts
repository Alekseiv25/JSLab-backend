import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TokensModule } from '../tokens/tokens.module';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './transactions.model';

@Module({
  controllers: [TransactionsController],
  providers: [TransactionsService],
  imports: [SequelizeModule.forFeature([Transaction]), TokensModule],
})
export class TransactionsModule {}
