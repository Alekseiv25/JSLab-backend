import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode } from '@nestjs/common';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { IBasicResponse } from 'src/types/responses';
import {
  IBasicStationResponse,
  ICheckStationEmailResponse,
  IDeleteStationResponse,
  IGetAllStationsResponse,
} from 'src/types/responses/stations';

@Controller('stations')
export class StationsController {
  constructor(private stationsService: StationsService) {}

  @Get()
  getAllStations(): Promise<IGetAllStationsResponse | IBasicResponse> {
    return this.stationsService.getAllStations();
  }

  @Get(':id')
  getStationById(@Param('id') id: number): Promise<IBasicStationResponse | IBasicResponse> {
    return this.stationsService.getStationById(id);
  }

  @Post()
  createNewStation(
    @Body() stationDto: CreateStationDto,
  ): Promise<IBasicStationResponse | IBasicResponse> {
    return this.stationsService.createNewStation(stationDto);
  }

  @Post('name-uniqueness')
  @HttpCode(200)
  async checkUniquenessOfStationName(
    @Body('name') name: string,
  ): Promise<ICheckStationEmailResponse> {
    return this.stationsService.checkUniquenessOfName(name);
  }

  @Put(':id')
  updateStationData(
    @Param('id') id: number,
    @Body() updatedData: CreateStationDto,
  ): Promise<IBasicStationResponse | IBasicResponse> {
    return this.stationsService.updateStation(id, updatedData);
  }

  @Delete(':id')
  deleteStation(@Param('id') id: number): Promise<IDeleteStationResponse | IBasicResponse> {
    return this.stationsService.deleteStation(id);
  }
}
