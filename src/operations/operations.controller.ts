import { IBasicOperationResponse, IGetAllOperationsResponse } from 'src/types/responses/operations';
import { OperationsService } from './operations.service';
import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';

@Controller('operations')
export class OperationsController {
  constructor(private operationsService: OperationsService) {}

  @Get()
  GetAllOperations(): Promise<IGetAllOperationsResponse> {
    return this.operationsService.getAllOperations();
  }

  @Get('stationId/:stationId')
  getOperationsByStationId(
    @Param('stationId') stationId: number,
  ): Promise<IGetAllOperationsResponse> {
    return this.operationsService.getOperationsByStationId(stationId);
  }

  @Get(':id')
  getOperationById(@Param('id') id: number): Promise<IBasicOperationResponse> {
    return this.operationsService.getOperationById(id);
  }

  @Put(':id')
  updateOperationData(
    @Param('id') id: number,
    @Body() updatedData: CreateOperationDto,
  ): Promise<IBasicOperationResponse> {
    return this.operationsService.updateOperation(id, updatedData);
  }
}
