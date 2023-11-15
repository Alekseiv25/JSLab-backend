import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { FuelPricesService } from './fuel_prices.service';
import {
  IBasicFuelPriceResponse,
  IDeleteFuelPriceResponse,
  IGetAllFuelPricesResponse,
} from 'src/types/responses/fuel_prices';
import { CreateFuelPriceDto } from './dto/fuel-price.dto';

@Controller('fuel-prices')
export class FuelPricesController {
  constructor(private fuelPricesService: FuelPricesService) {}

  @Get()
  getAllFuelPrices() {
    return this.fuelPricesService.getAllFuelPrices();
  }

  @Get(':id')
  getFuelPriceById(@Param('id') id: number): Promise<IBasicFuelPriceResponse> {
    return this.fuelPricesService.GetFuelPriceById(id);
  }

  @Get('stations/:stationId')
  getFuelPricesByStationId(
    @Param('stationId') stationId: number,
  ): Promise<IGetAllFuelPricesResponse> {
    return this.fuelPricesService.getFuelPricesByStationId(stationId);
  }

  @Post()
  createNewFuelPrice(@Body() fuelPriceDto: CreateFuelPriceDto): Promise<IBasicFuelPriceResponse> {
    return this.fuelPricesService.createNewFuelPrice(fuelPriceDto);
  }

  @Put(':id')
  updateFuelPrice(
    @Param('id') id: number,
    @Body() updatedData: CreateFuelPriceDto,
  ): Promise<IBasicFuelPriceResponse> {
    return this.fuelPricesService.updateFuelPrice(id, updatedData);
  }

  @Delete(':id')
  deleteFuelPrice(@Param('id') id: number): Promise<IDeleteFuelPriceResponse> {
    return this.fuelPricesService.deleteFuelPrice(id);
  }
}
