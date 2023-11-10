import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import {
  IBasicStationResponse,
  ICheckStationNameResponse,
  IDeleteStationResponse,
  IGetAllStationsResponse,
} from 'src/types/responses/stations';

@Controller('stations')
export class StationsController {
  constructor(private stationsService: StationsService) {}

  @Get()
  getAllStations(): Promise<IGetAllStationsResponse> {
    return this.stationsService.getAllStations();
  }

  @Get(':id')
  getStationById(@Param('id') id: number): Promise<IBasicStationResponse> {
    return this.stationsService.getStationById(id);
  }

  @Post()
  createNewStation(
    @Body() stationDto: CreateStationDto,
  ): Promise<IBasicStationResponse | ICheckStationNameResponse> {
    return this.stationsService.createNewStation(stationDto);
  }

  @Post('name-uniqueness')
  @HttpCode(200)
  async checkUniquenessOfStationName(
    @Body('name') name: string,
  ): Promise<ICheckStationNameResponse> {
    return this.stationsService.checkUniquenessOfName(name);
  }

  @Put(':id')
  updateStationData(
    @Param('id') id: number,
    @Body() updatedData: CreateStationDto,
  ): Promise<IBasicStationResponse> {
    return this.stationsService.updateStation(id, updatedData);
  }

  @Delete(':id')
  deleteStation(@Param('id') id: number): Promise<IDeleteStationResponse> {
    return this.stationsService.deleteStation(id);
  }
}
