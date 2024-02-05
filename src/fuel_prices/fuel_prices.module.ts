import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FuelPrice } from './fuel_prices.model';
import { FuelPricesService } from './fuel_prices.service';
import { FuelPricesController } from './fuel_prices.controller';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  controllers: [FuelPricesController],
  providers: [FuelPricesService],
  imports: [SequelizeModule.forFeature([FuelPrice]), TokensModule],
})
export class FuelPricesModule {}
