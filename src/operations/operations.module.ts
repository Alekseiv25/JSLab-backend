import { Module } from '@nestjs/common';
import { Operation } from './operations.model';
import { TokensModule } from '../tokens/tokens.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';

@Module({
  controllers: [OperationsController],
  providers: [OperationsService],
  imports: [SequelizeModule.forFeature([Operation]), TokensModule],
})
export class OperationsModule {}
