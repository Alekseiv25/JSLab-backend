import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  IBasicStationResponse,
  ICheckStationNameResponse,
  IDeleteStationResponse,
  IGetAllStationsResponse,
} from 'src/types/responses/stations';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  UseGuards,
  Query,
} from '@nestjs/common';

@Controller('stations')
export class StationsController {
  constructor(private stationsService: StationsService) {}

  @Get()
  @UseGuards(AuthGuard)
  getAllStations(): Promise<IGetAllStationsResponse> {
    return this.stationsService.getAllStations();
  }

  @Get('businesses/:businessId')
  @UseGuards(AuthGuard)
  getStationsByBusinessId(
    @Param('businessId') businessId: number,
    @Query('searchQuery') searchQuery?: string,
    @Query('name') name?: string,
    @Query('address') address?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<IGetAllStationsResponse> {
    return this.stationsService.getStationsByBusinessId(
      businessId,
      searchQuery,
      name,
      address,
      fromDate,
      toDate,
      limit,
      offset,
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getStationById(@Param('id') id: number): Promise<IBasicStationResponse> {
    return this.stationsService.getStationById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  createNewStation(
    @Body() stationDto: CreateStationDto,
  ): Promise<IBasicStationResponse | ICheckStationNameResponse> {
    return this.stationsService.createNewStation(stationDto);
  }

  @Post('name-uniqueness')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async checkUniquenessOfStationName(
    @Body('name') name: string,
  ): Promise<ICheckStationNameResponse> {
    return this.stationsService.checkUniquenessOfName(name);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateStationData(
    @Param('id') id: number,
    @Body() updatedData: CreateStationDto,
  ): Promise<IBasicStationResponse> {
    return this.stationsService.updateStation(id, updatedData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteStation(@Param('id') id: number): Promise<IDeleteStationResponse> {
    return this.stationsService.deleteStation(id);
  }
}
