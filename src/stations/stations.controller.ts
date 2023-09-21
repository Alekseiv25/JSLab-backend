import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';

@Controller('stations')
export class StationsController {
  constructor(private stationsService: StationsService) {}

  @Get()
  getAllStations() {
    return this.stationsService.getAllStations();
  }

  @Post()
  createNewStation(@Body() stationDto: CreateStationDto) {
    return this.stationsService.createNewStation(stationDto);
  }

  @Put(':id')
  updateBusiness(@Param('id') id: number, @Body() updatedStationDto: CreateStationDto) {
    return this.stationsService.updateStation(id, updatedStationDto);
  }

  @Delete(':id')
  deleteBusiness(@Param('id') id: number) {
    return this.stationsService.deleteStation(id);
  }
}