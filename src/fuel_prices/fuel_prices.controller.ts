import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { FuelPricesService } from './fuel_prices.service';
import {
  IBasicFuelPriceResponse,
  IDeleteFuelPriceResponse,
  IDeleteFuelPricesResponse,
  IGetAllFuelPricesResponse,
} from '../types/responses/fuel_prices';
import { CreateFuelPriceDto } from './dto/fuel-price.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('fuel-prices')
export class FuelPricesController {
  constructor(private fuelPricesService: FuelPricesService) {}

  @Get()
  @UseGuards(AuthGuard)
  getAllFuelPrices() {
    return this.fuelPricesService.getAllFuelPrices();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getFuelPriceById(@Param('id') id: number): Promise<IBasicFuelPriceResponse> {
    return this.fuelPricesService.GetFuelPriceById(id);
  }

  @Get('stations/:stationId')
  @UseGuards(AuthGuard)
  async getFuelPricesByStationId(
    @Param('stationId') stationId: number,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
  ): Promise<IGetAllFuelPricesResponse> {
    return this.fuelPricesService.getFuelPricesByStationId(stationId, offset, limit);
  }

  @Post()
  @UseGuards(AuthGuard)
  createNewFuelPrice(@Body() fuelPriceDto: CreateFuelPriceDto): Promise<IBasicFuelPriceResponse> {
    return this.fuelPricesService.createNewFuelPrice(fuelPriceDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateFuelPrice(
    @Param('id') id: number,
    @Body() updatedData: CreateFuelPriceDto,
  ): Promise<IBasicFuelPriceResponse> {
    return this.fuelPricesService.updateFuelPrice(id, updatedData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteFuelPrice(@Param('id') id: number): Promise<IDeleteFuelPriceResponse> {
    return this.fuelPricesService.deleteFuelPrice(id);
  }

  @Delete()
  deleteFuelPrices(@Body() ids: number[]): Promise<IDeleteFuelPricesResponse> {
    return this.fuelPricesService.deleteFuelPrices(ids);
  }
}
