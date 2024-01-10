import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './payments.model';
import {
  IBasicPaymentResponse,
  IDeletePaymentsResponse,
  IGetAllPaymentsResponse,
} from 'src/types/responses/payments';
import { makeDeleteMessage, makeNotFoundMessage } from 'src/utils/generators/messageGenerators';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { CreatePaymentDto } from './dto/payments.dto';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment) private paymentRepository: typeof Payment) {}

  async getAllPayments(): Promise<IGetAllPaymentsResponse> {
    const payments: Payment[] | [] = await this.paymentRepository.findAll();
    if (payments.length === 0) {
      throw new HttpException(makeNotFoundMessage('Payments'), HttpStatus.NOT_FOUND);
    }
    const response: IGetAllPaymentsResponse = { status: HttpStatus.OK, data: payments };
    return response;
  }

  async getPaymentsByBusinessId(
    businessId: number,
    limit: number,
    offset: number,
  ): Promise<IGetAllPaymentsResponse> {
    const where: WhereOptions = {
      businessId: {
        [Op.in]: [businessId],
      },
    };

    const options: FindOptions = {
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    };

    const { count, rows: payments } = await this.paymentRepository.findAndCountAll(options);

    if (payments.length === 0) {
      throw new HttpException(makeNotFoundMessage('Payments'), HttpStatus.NOT_FOUND);
    }

    const response: IGetAllPaymentsResponse = {
      status: HttpStatus.OK,
      data: payments,
      totalCount: count,
    };
    return response;
  }

  async getPaymentsByStationId(
    stationId: number,
    limit: number,
    offset: number,
  ): Promise<IGetAllPaymentsResponse> {
    const where: WhereOptions = {
      stationId: {
        [Op.in]: [stationId],
      },
    };

    const options: FindOptions = {
      where,
      limit,
      offset,
      order: [['id', 'DESC']],
    };

    const { count, rows: payments } = await this.paymentRepository.findAndCountAll(options);

    if (payments.length === 0) {
      throw new HttpException(makeNotFoundMessage('Payments'), HttpStatus.NOT_FOUND);
    }

    const response: IGetAllPaymentsResponse = {
      status: HttpStatus.OK,
      data: payments,
      totalCount: count,
    };
    return response;
  }

  async getPaymentById(id: number): Promise<IBasicPaymentResponse> {
    const payment: Payment | null = await this.paymentRepository.findByPk(id);

    if (!payment) {
      throw new HttpException(makeNotFoundMessage('Payment'), HttpStatus.NOT_FOUND);
    }
    const response: IBasicPaymentResponse = { status: HttpStatus.OK, data: payment };
    return response;
  }

  async createNewPayment(dto: CreatePaymentDto): Promise<IBasicPaymentResponse> {
    const payment: Payment = await this.paymentRepository.create(dto);
    const response: IBasicPaymentResponse = { status: HttpStatus.OK, data: payment };
    return response;
  }

  async deletePayments(ids: number[]): Promise<IDeletePaymentsResponse> {
    const payments: Payment[] = await this.paymentRepository.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    if (payments.length === 0) {
      throw new HttpException(makeNotFoundMessage('Payments'), HttpStatus.NOT_FOUND);
    }

    await this.paymentRepository.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    const response: IDeletePaymentsResponse = {
      status: HttpStatus.OK,
      message: makeDeleteMessage('Payments'),
      data: payments,
    };

    return response;
  }
}
