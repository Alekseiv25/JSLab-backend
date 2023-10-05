import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { IBasicResponseObject, IResponseObjectWithStationData } from 'src/types/responses';

@Controller('stations')
export class StationsController {
  constructor(private stationsService: StationsService) {}

  @Get()
  getAllStations() {
    return this.stationsService.getAllStations();
  }

  @Get(':id')
  getStationById(
    @Param('id') id: number,
  ): Promise<IResponseObjectWithStationData | IBasicResponseObject> {
    return this.stationsService.getStationById(id);
  }

  @Post()
  createNewStation(@Body() stationDto: CreateStationDto) {
    return this.stationsService.createNewStation(stationDto);
  }

  @Post('name-uniqueness')
  async checkUniquenessOfStationName(@Body('name') name: string) {
    return await this.stationsService.checkUniquenessOfName(name);
  }

  @Put(':id')
  updateStationData(@Param('id') id: number, @Body() updatedData: CreateStationDto) {
    return this.stationsService.updateStation(id, updatedData);
  }

  @Delete(':id')
  deleteStation(@Param('id') id: number) {
    return this.stationsService.deleteStation(id);
  }
}
