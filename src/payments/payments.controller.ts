import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  IBasicPaymentResponse,
  IDeletePaymentsResponse,
  IGetAllPaymentsResponse,
} from 'src/types/responses/payments';
import { CreatePaymentDto } from './dto/payments.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get()
  @UseGuards(AuthGuard)
  getAllTransactions() {
    return this.paymentsService.getAllPayments();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getPaymentById(@Param('id') id: number): Promise<IBasicPaymentResponse> {
    return this.paymentsService.getPaymentById(id);
  }

  @Get('businesses/:businessId')
  @UseGuards(AuthGuard)
  getPaymentsByBusinessId(
    @Param('businessId') businessId: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<IGetAllPaymentsResponse> {
    return this.paymentsService.getPaymentsByBusinessId(businessId, limit, offset);
  }

  @Get('stations/:stationId')
  @UseGuards(AuthGuard)
  getPaymentsByStationId(
    @Param('stationId') stationId: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ): Promise<IGetAllPaymentsResponse> {
    return this.paymentsService.getPaymentsByStationId(stationId, limit, offset);
  }

  @Post()
  @UseGuards(AuthGuard)
  createNewPayment(@Body() transactionDto: CreatePaymentDto): Promise<IBasicPaymentResponse> {
    return this.paymentsService.createNewPayment(transactionDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  deletePayments(@Body() ids: number[]): Promise<IDeletePaymentsResponse> {
    return this.paymentsService.deletePayments(ids);
  }
}
