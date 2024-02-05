import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment } from './payments.model';
import {
  IBasicPaymentResponse,
  IDeletePaymentsResponse,
  IGetAllPaymentsResponse,
} from '../types/responses/payments';
import { makeDeleteMessage, makeNotFoundMessage } from '../utils/generators/messageGenerators';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { CreatePaymentDto } from './dto/payments.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { StationsService } from '../stations/stations.service';
import { Station } from '../stations/stations.model';
import { UsersService } from '../users/users.service';
import { User } from '../users/users.model';
import { applyPaginationOptions, calculateAmountOfPages } from '../utils/pagination';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment) private paymentRepository: typeof Payment,
    private notificationsService: NotificationsService,
    private stationsService: StationsService,
    private usersService: UsersService,
  ) {}

  async getAllPayments(): Promise<IGetAllPaymentsResponse> {
    const payments: Payment[] | [] = await this.paymentRepository.findAll();
    if (payments.length === 0) {
      throw new HttpException(makeNotFoundMessage('Payments'), HttpStatus.NOT_FOUND);
    }
    const response: IGetAllPaymentsResponse = {
      status: HttpStatus.OK,
      data: { payments: payments },
    };
    return response;
  }

  async getPaymentsByBusinessId(
    businessId: number,
    limit?: number,
    page?: number,
  ): Promise<IGetAllPaymentsResponse> {
    const where: WhereOptions = {
      businessId: {
        [Op.in]: [businessId],
      },
    };

    const options: FindOptions = {
      where,
      order: [['id', 'DESC']],
    };

    applyPaginationOptions(options, limit, page);

    const { count, rows: payments } = await this.paymentRepository.findAndCountAll(options);

    if (payments.length === 0) {
      throw new HttpException(makeNotFoundMessage('Payments'), HttpStatus.NOT_FOUND);
    }

    const amountOfPages = calculateAmountOfPages(count, limit);
    const currentPage = page;

    const response: IGetAllPaymentsResponse = {
      status: HttpStatus.OK,
      data: {
        payments: payments,
        params: {
          totalCount: count,
          amountOfPages,
          currentPage,
        },
      },
    };
    return response;
  }

  async getPaymentsByStationId(
    stationId: number,
    limit?: number,
    page?: number,
  ): Promise<IGetAllPaymentsResponse> {
    const where: WhereOptions = {
      stationId: {
        [Op.in]: [stationId],
      },
    };

    const options: FindOptions = {
      where,
      order: [['id', 'DESC']],
    };

    applyPaginationOptions(options, limit, page);
    const { count, rows: payments } = await this.paymentRepository.findAndCountAll(options);
    const amountOfPages = calculateAmountOfPages(count, limit);
    const currentPage = page;

    if (payments.length === 0) {
      throw new HttpException(makeNotFoundMessage('Payments'), HttpStatus.NOT_FOUND);
    }

    const response: IGetAllPaymentsResponse = {
      status: HttpStatus.OK,
      data: {
        payments: payments,
        params: {
          totalCount: count,
          amountOfPages,
          currentPage,
        },
      },
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

  async createNewPayment(userId: number, dto: CreatePaymentDto): Promise<IBasicPaymentResponse> {
    const payment: Payment = await this.paymentRepository.create(dto);

    const businessAdmin: User = await this.usersService.findUserByBusinessId(dto.businessId);
    const user: User = await this.usersService.findUserByID(userId);

    if (businessAdmin.id !== user.id) {
      const station: Station = await this.stationsService.findStationById(dto.stationId);
      await this.notificationsService.createPaymentNotificationForAdmin(
        businessAdmin.id,
        `${user.firstName} ${user.lastName}`,
        station.name,
        dto.paymentAmount,
        dto.paymentName,
      );
    }

    const response: IBasicPaymentResponse = { status: HttpStatus.OK, data: payment };
    return response;
  }

  async deletePayments(userId, paymentsIdsForDelete: number[]): Promise<IDeletePaymentsResponse> {
    const payments: Payment[] = await this.paymentRepository.findAll({
      where: {
        id: {
          [Op.in]: paymentsIdsForDelete,
        },
      },
    });

    if (payments.length === 0) {
      throw new HttpException(makeNotFoundMessage('Payments'), HttpStatus.NOT_FOUND);
    }

    await this.paymentRepository.destroy({
      where: {
        id: {
          [Op.in]: paymentsIdsForDelete,
        },
      },
    });

    const station: Station = await this.stationsService.findStationById(payments[0].stationId);
    const businessAdmin: User = await this.usersService.findUserByBusinessId(station.businessId);

    if (businessAdmin.id !== userId) {
      const user: User = await this.usersService.findUserByID(userId);

      let paymentsAmount: number = 0;
      const paymentsSubjects: string[] = [];

      for (const payment of payments) {
        paymentsAmount += parseFloat(payment.paymentAmount);
        if (!paymentsSubjects.includes(payment.paymentName)) {
          paymentsSubjects.push(payment.paymentName);
        }
      }

      await this.notificationsService.createDeletePaymentNotificationForAdmin(
        businessAdmin.id,
        `${user.firstName} ${user.lastName}`,
        station.name,
        String(paymentsAmount),
        paymentsSubjects,
      );
    }

    const response: IDeletePaymentsResponse = {
      status: HttpStatus.OK,
      message: makeDeleteMessage('Payments'),
      data: payments,
    };

    return response;
  }
}
