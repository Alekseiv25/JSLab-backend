import { Module } from '@nestjs/common';
import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Business } from './businesses.model';
import { TokensModule } from 'src/tokens/tokens.module';

@Module({
  controllers: [BusinessesController],
  providers: [BusinessesService],
  imports: [SequelizeModule.forFeature([Business]), TokensModule],
})
export class BusinessesModule {}
