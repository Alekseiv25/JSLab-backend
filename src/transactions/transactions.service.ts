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
import { Op } from 'sequelize';

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
