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
import { applyPaginationOptions, calculateAmountOfPages } from 'src/utils/pagination';

@Injectable()
export class TransactionsService {
  constructor(@InjectModel(Transaction) private transactionsRepository: typeof Transaction) {}

  async getAllTransactions(): Promise<IGetAllTransactionsResponse> {
    const transactions: Transaction[] | [] = await this.transactionsRepository.findAll();

    if (transactions.length === 0) {
      throw new HttpException(makeNotFoundMessage('Transactions'), HttpStatus.NOT_FOUND);
    }
    const response: IGetAllTransactionsResponse = {
      status: HttpStatus.OK,
      data: { transactions: transactions },
    };
    return response;
  }

  async getTransactionsByBusinessId(
    businessId: number,
    fromDate?: string,
    toDate?: string,
    fuelType?: string,
    discount?: string,
    limit?: number,
    page?: number,
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

    if (fuelType) {
      const fuelTypeList = fuelType.split(',');
      where.fuelType = {
        [Op.in]: fuelTypeList,
      };
    }

    if (discount) {
      const discountList = discount.split(',');
      where.discount = {
        [Op.in]: discountList,
      };
    }

    const options: FindOptions = {
      where,
      order: [['createdAt', 'DESC']],
    };

    applyPaginationOptions(options, limit, page);

    const transactions: Transaction[] | null = await this.transactionsRepository.findAll(options);

    if (transactions.length === 0) {
      throw new HttpException(makeNotFoundMessage('Transactions'), HttpStatus.NOT_FOUND);
    }

    const totalCount = await this.transactionsRepository.count({ where });
    const amountOfPages = calculateAmountOfPages(totalCount, limit);
    const currentPage = page;

    const response: IGetAllTransactionsResponse = {
      status: HttpStatus.OK,
      data: {
        transactions: transactions,
        params: { totalCount, amountOfPages, currentPage },
      },
    };
    return response;
  }

  async getTransactionsByStationId(
    stationId: number,
    fromDate?: string,
    toDate?: string,
    fuelType?: string,
    discount?: string,
    limit?: number,
    page?: number,
  ): Promise<IGetAllTransactionsResponse> {
    const where: WhereOptions<Transaction> = {
      stationId: {
        [Op.in]: [stationId],
      },
    };

    const conditions: WhereOptions<Transaction>[] = [];

    if (fromDate && toDate) {
      where.createdAt = {
        [Op.between]: [fromDate, toDate],
      };
    } else if (fromDate) {
      where.createdAt = {
        [Op.gte]: fromDate,
      };
    } else if (toDate) {
      where.createdAt = {
        [Op.lte]: toDate,
      };
    }

    if (fuelType) {
      const fuelTypeList = fuelType
        .split(',')
        .map((el) => ({ fuelType: { [Op.like]: `%${el.trim()}%` } }));
      conditions.push({ [Op.or]: fuelTypeList });
    }

    if (discount) {
      const discountList = discount
        .split(',')
        .map((el) => ({ discount: { [Op.like]: `%${el.trim()}%` } }));
      conditions.push({ [Op.or]: discountList });
    }

    if (conditions.length > 0) {
      where[Op.and] = conditions;
    } else {
      where[Op.and] = {};
    }

    const options: FindOptions = {
      where,
      order: [['createdAt', 'DESC']],
    };

    applyPaginationOptions(options, limit, page);
    const transactions: Transaction[] | null = await this.transactionsRepository.findAll(options);

    if (transactions.length === 0) {
      throw new HttpException(makeNotFoundMessage('Transactions'), HttpStatus.NOT_FOUND);
    }

    const totalCount = await this.transactionsRepository.count({ where });
    const amountOfPages = calculateAmountOfPages(totalCount, limit);
    const currentPage = page;

    const response: IGetAllTransactionsResponse = {
      status: HttpStatus.OK,
      data: { transactions: transactions, params: { totalCount, amountOfPages, currentPage } },
    };
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
