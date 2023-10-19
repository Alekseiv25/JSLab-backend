import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Account } from './accounts.model';
import { CreateAccountDto } from './dto/create-account.dto';
import * as crypto from 'crypto';
import { decrypt, encrypt } from '../utils/crypto';
import {
  IBasicAccountResponse,
  IDeleteAccountResponse,
  IGetAllAccountsResponse,
} from '../types/responses/accounts';
import { makeDeleteMessage, makeNotFoundMessage } from '../utils/generators/messageGenerators';
import { Op } from 'sequelize';

@Injectable()
export class AccountsService {
  key: Buffer;
  constructor(@InjectModel(Account) private accountRepository: typeof Account) {
    this.key = crypto.randomBytes(32);
  }

  async getAllAccounts() {
    const accounts: Account[] | null = await this.accountRepository.findAll();

    if (accounts.length === 0) {
      throw new HttpException(makeNotFoundMessage('Accounts'), HttpStatus.NOT_FOUND);
    }

    const decryptedAccounts = accounts.map((account) => {
      const decryptedRoutingNumber = decrypt(account.routingNumber, this.key);
      const decryptedAccountNumber = decrypt(account.accountNumber, this.key);
      return {
        ...account.toJSON(),
        routingNumber: decryptedRoutingNumber,
        accountNumber: decryptedAccountNumber,
      };
    });
    return decryptedAccounts;
  }

  async getAccountsByBusinessId(businessId: number): Promise<IGetAllAccountsResponse> {
    const accounts: Account[] = await this.accountRepository.findAll({
      where: {
        businessId: {
          [Op.in]: [businessId],
        },
      },
    });

    if (!accounts) {
      throw new HttpException(makeNotFoundMessage('Accounts'), HttpStatus.NOT_FOUND);
    }

    const response: IGetAllAccountsResponse = { status: HttpStatus.OK, data: accounts };
    return response;
  }

  async createNewAccount(dto: CreateAccountDto): Promise<IBasicAccountResponse> {
    const encryptedDto = {
      ...dto,
      routingNumber: encrypt(dto.routingNumber, this.key),
      accountNumber: encrypt(dto.accountNumber, this.key),
    };

    const newAccount: Account = await this.accountRepository.create(encryptedDto);
    const response: IBasicAccountResponse = { status: HttpStatus.OK, data: newAccount };
    return response;
  }

  async updateAccount(id: number, dto: CreateAccountDto): Promise<IBasicAccountResponse> {
    const account: Account | null = await this.accountRepository.findOne({ where: { id } });

    if (!account) {
      throw new HttpException(makeNotFoundMessage('Account'), HttpStatus.NOT_FOUND);
    }

    const updatedAccount: Account = await account.update(dto);
    const response: IBasicAccountResponse = { status: HttpStatus.OK, data: updatedAccount };
    return response;
  }

  async deleteAccount(id: number): Promise<IDeleteAccountResponse> {
    const account: Account | null = await this.accountRepository.findByPk(id);

    if (!account) {
      throw new HttpException(makeNotFoundMessage('Account'), HttpStatus.NOT_FOUND);
    }

    await account.destroy();
    const response: IDeleteAccountResponse = {
      status: HttpStatus.OK,
      message: makeDeleteMessage('Account'),
      data: account,
    };
    return response;
  }
}
