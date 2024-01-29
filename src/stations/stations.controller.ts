import { IGlobalSearchStationsResponse } from 'src/types/responses/globalSEarch';
import { StationsService } from './stations.service';
import { CreateStationDto } from './dto/create-station.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  IBasicStationResponse,
  ICheckStationNameResponse,
  IDeleteStationResponse,
  IDeleteStationsResponse,
  IGetAllStationsResponse,
  IGetStationResponse,
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
  Headers,
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
  async getStationsByBusinessId(
    @Param('businessId') businessId: number,
    @Query('searchQuery') searchQuery?: string,
    @Query('name') name?: string,
    @Query('address') address?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ): Promise<IGetAllStationsResponse> {
    const response = await this.stationsService.getStationsByBusinessId(
      businessId,
      searchQuery,
      name,
      address,
      fromDate,
      toDate,
      limit,
      page,
    );

    return response;
  }

  @Get('users/:userId')
  @UseGuards(AuthGuard)
  async getStationsByUserId(
    @Param('userId') userId: number,
    @Query('searchQuery') searchQuery?: string,
    @Query('name') name?: string,
    @Query('address') address?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ): Promise<IGetAllStationsResponse> {
    const response = await this.stationsService.getStationsByUserId(
      userId,
      searchQuery,
      name,
      address,
      fromDate,
      toDate,
      limit,
      page,
    );

    return response;
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getStationById(
    @Param('id') id: number,
    @Query('userId') userId: number,
  ): Promise<IGetStationResponse> {
    return this.stationsService.getStationById(id, userId);
  }

  @Post()
  @UseGuards(AuthGuard)
  createNewStation(
    @Headers('userId') userId: string,
    @Body() stationDto: CreateStationDto,
  ): Promise<IBasicStationResponse | ICheckStationNameResponse> {
    return this.stationsService.createNewStation(stationDto, Number(userId));
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

  @Delete()
  @UseGuards(AuthGuard)
  deleteStations(@Body() ids: number[]): Promise<IDeleteStationsResponse> {
    return this.stationsService.deleteStations(ids);
  }

  @Get('search')
  @UseGuards(AuthGuard)
  getStationsBySearchValue(
    @Query('userId') userId: number,
    @Query('searchValue') searchValue: string,
    @Query('currentPage') currentPage: number,
    @Query('itemsPerPage') itemsPerPage: number,
  ): Promise<IGlobalSearchStationsResponse> {
    return this.stationsService.getStationsBySearchValue(
      Number(userId),
      searchValue,
      Number(currentPage),
      Number(itemsPerPage),
    );
  }
}
