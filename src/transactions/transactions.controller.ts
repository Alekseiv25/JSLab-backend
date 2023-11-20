import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  IBasicTransactionResponse,
  IDeleteTransactionsResponse,
} from 'src/types/responses/transactions';
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
