import { Module } from '@nestjs/common';
import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Business } from './businesses.model';

@Module({
  controllers: [BusinessesController],
  providers: [BusinessesService],
  imports: [SequelizeModule.forFeature([Business])],
})
export class BusinessesModule {}
