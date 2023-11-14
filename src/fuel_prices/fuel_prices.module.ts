import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FuelPrice } from './fuel_prices.model';
import { FuelPricesService } from './fuel_prices.service';
import { FuelPricesController } from './fuel_prices.controller';

@Module({
  controllers: [FuelPricesController],
  providers: [FuelPricesService],
  imports: [SequelizeModule.forFeature([FuelPrice])],
})
export class FuelPricesModule {}
