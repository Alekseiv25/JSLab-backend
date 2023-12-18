import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from './transactions.model';
import {
  IBasicTransactionResponse,
  IDeleteTransactionsResponse,
  IGetAllTransactionsResponse,
} from 'src/types/responses/transactions';
import { makeDeleteMessage, makeNotFoundMessage } from 'src/utils/generators/messageGenerators';
import { CreateTransactionDto } from './dto/transactions.dto';
import { FindOptions, Op, WhereOptions } from 'sequelize';

@Injectable()
export class TransactionsService {
  constructor(@InjectModel(Transaction) private transactionsRepository: typeof Transaction) {}

  async getAllTransactions(): Promise<IGetAllTransactionsResponse> {
    const transactions: Transaction[] | [] = await this.transactionsRepository.findAll();

    if (transactions.length === 0) {
      throw new HttpException(makeNotFoundMessage('Transactions'), HttpStatus.NOT_FOUND);
    }
    const response: IGetAllTransactionsResponse = { status: HttpStatus.OK, data: transactions };
    return response;
  }

  async getTransactionsByBusinessId(
    businessId: number,
    fromDate?: string,
    toDate?: string,
    fuelTypes?: string,
    discounts?: string,
    limit?: number,
    offset?: number,
  ): Promise<IGetAllTransactionsResponse> {
    const where: WhereOptions<Transaction> = {
      businessId: {
        [Op.in]: [businessId],
      },
    };

    if (fromDate && toDate) {
      where.createdAt = {
        [Op.between]: [new Date(fromDate), new Date(toDate)],
      };
    } else if (fromDate) {
      where.createdAt = {
        [Op.gte]: new Date(fromDate),
      };
    } else if (toDate) {
      where.createdAt = {
        [Op.lte]: new Date(toDate),
      };
    }

    if (fuelTypes) {
      const fuelTypeList = fuelTypes.split(',');
      where.fuelType = {
        [Op.in]: fuelTypeList,
      };
    }

    if (discounts) {
      const discountList = discounts.split(',');
      where.discount = {
        [Op.in]: discountList,
      };
    }

    const options: FindOptions = {
      where,
      order: [['createdAt', 'DESC']],
    };

    if (limit) {
      options.limit = limit;
    }

    if (offset) {
      options.offset = offset;
    }

    const transactions: Transaction[] | null = await this.transactionsRepository.findAll(options);

    if (transactions.length === 0) {
      throw new HttpException(makeNotFoundMessage('Transactions'), HttpStatus.NOT_FOUND);
    }

    const response: IGetAllTransactionsResponse = { status: HttpStatus.OK, data: transactions };
    return response;
  }

  async getTransactionsByStationId(
    stationId: number,
    fromDate?: string,
    toDate?: string,
    fuelTypes?: string,
    discounts?: string,
    limit?: number,
    offset?: number,
  ): Promise<IGetAllTransactionsResponse> {
    const where: WhereOptions<Transaction> = {
      stationId: {
        [Op.in]: [stationId],
      },
    };

    if (fromDate && toDate) {
      where.createdAt = {
        [Op.between]: [new Date(fromDate), new Date(toDate)],
      };
    } else if (fromDate) {
      where.createdAt = {
        [Op.gte]: new Date(fromDate),
      };
    } else if (toDate) {
      where.createdAt = {
        [Op.lte]: new Date(toDate),
      };
    }

    if (fuelTypes) {
      const fuelTypeList = fuelTypes.split(',');
      where.fuelType = {
        [Op.in]: fuelTypeList,
      };
    }

    if (discounts) {
      const discountList = discounts.split(',');
      where.discount = {
        [Op.in]: discountList,
      };
    }

    const options: FindOptions = {
      where,
      order: [['createdAt', 'DESC']],
    };

    if (limit) {
      options.limit = limit;
    }

    if (offset) {
      options.offset = offset;
    }

    const transactions: Transaction[] | null = await this.transactionsRepository.findAll(options);

    if (transactions.length === 0) {
      throw new HttpException(makeNotFoundMessage('Transactions'), HttpStatus.NOT_FOUND);
    }

    const response: IGetAllTransactionsResponse = { status: HttpStatus.OK, data: transactions };
    return response;
  }

  async GetTransactionById(id: number): Promise<IBasicTransactionResponse> {
    const transaction: Transaction | null = await this.transactionsRepository.findByPk(id);

    if (!transaction) {
      throw new HttpException(makeNotFoundMessage('Transactions'), HttpStatus.NOT_FOUND);
    }

    const response: IBasicTransactionResponse = { status: HttpStatus.OK, data: transaction };
    return response;
  }

  async createNewTransaction(dto: CreateTransactionDto): Promise<IBasicTransactionResponse> {
    const transaction: Transaction = await this.transactionsRepository.create(dto);
    const response: IBasicTransactionResponse = { status: HttpStatus.OK, data: transaction };
    return response;
  }

  async deleteTransactions(ids: number[]): Promise<IDeleteTransactionsResponse> {
    const transactions: Transaction[] = await this.transactionsRepository.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    if (transactions.length === 0) {
      throw new HttpException(makeNotFoundMessage('Transactions'), HttpStatus.NOT_FOUND);
    }

    await this.transactionsRepository.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    const response: IDeleteTransactionsResponse = {
      status: HttpStatus.OK,
      message: makeDeleteMessage('Transactions'),
      data: transactions,
    };

    return response;
  }
}
