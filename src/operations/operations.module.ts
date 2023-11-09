import { Module } from '@nestjs/common';
import { Operation } from './operations.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [],
  providers: [],
  imports: [SequelizeModule.forFeature([Operation])],
})
export class OperationsModule {}
