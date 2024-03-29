import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '../auth/auth.guard';
import {
  IBasicTransactionResponse,
  IDeleteTransactionsResponse,
  IGetAllTransactionsResponse,
} from '../types/responses/transactions';
import { CreateTransactionDto } from './dto/transactions.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get()
  @UseGuards(AuthGuard)
  getAllTransactions() {
    return this.transactionsService.getAllTransactions();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getFuelTransactionById(@Param('id') id: number): Promise<IBasicTransactionResponse> {
    return this.transactionsService.GetTransactionById(id);
  }

  @Get('businesses/:businessId')
  @UseGuards(AuthGuard)
  getTransactionsByBusinessId(
    @Param('businessId') businessId: number,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('fuelType') fuelType?: string,
    @Query('discount') discount?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ): Promise<IGetAllTransactionsResponse> {
    return this.transactionsService.getTransactionsByBusinessId(
      businessId,
      fromDate,
      toDate,
      fuelType,
      discount,
      limit,
      Number(page),
    );
  }

  @Get('stations/:stationId')
  @UseGuards(AuthGuard)
  async getTransactionsByStationId(
    @Param('stationId') stationId: number,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('fuelType') fuelType?: string,
    @Query('discount') discount?: string,
    @Query('limit') limit?: number,
    @Query('page') page?: number,
  ): Promise<IGetAllTransactionsResponse> {
    const response = await this.transactionsService.getTransactionsByStationId(
      stationId,
      fromDate,
      toDate,
      fuelType,
      discount,
      limit,
      Number(page),
    );
    return response;
  }

  @Post()
  @UseGuards(AuthGuard)
  createNewFuelPrice(
    @Body() transactionDto: CreateTransactionDto,
  ): Promise<IBasicTransactionResponse> {
    return this.transactionsService.createNewTransaction(transactionDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  deleteFuelPrices(@Body() ids: number[]): Promise<IDeleteTransactionsResponse> {
    return this.transactionsService.deleteTransactions(ids);
  }
}
