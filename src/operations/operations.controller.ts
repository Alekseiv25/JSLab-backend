import { IBasicOperationResponse, IGetAllOperationsResponse } from '../types/responses/operations';
import { OperationsService } from './operations.service';
import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('operations')
export class OperationsController {
  constructor(private operationsService: OperationsService) {}

  @Get()
  @UseGuards(AuthGuard)
  GetAllOperations(): Promise<IGetAllOperationsResponse> {
    return this.operationsService.getAllOperations();
  }

  @Get('stations/:stationId')
  @UseGuards(AuthGuard)
  getOperationsByStationId(
    @Param('stationId') stationId: number,
  ): Promise<IGetAllOperationsResponse> {
    return this.operationsService.getOperationsByStationId(stationId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getOperationById(@Param('id') id: number): Promise<IBasicOperationResponse> {
    return this.operationsService.getOperationById(id);
  }

  @Put(':stationId')
  @UseGuards(AuthGuard)
  updateOperationsData(
    @Param('stationId') stationId: number,
    @Body() updatedData: CreateOperationDto[],
  ): Promise<IBasicOperationResponse[]> {
    return this.operationsService.updateOperations(stationId, updatedData);
  }
}
