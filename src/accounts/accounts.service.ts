import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Account } from './accounts.model';
import { CreateAccountDto } from './dto/create-account.dto';
import { decrypt, encrypt } from '../utils/crypto';
import {
  IBasicAccountResponse,
  IDeleteAccountResponse,
  IGetAllAccountsResponse,
} from '../types/responses/accounts';
import { makeDeleteMessage, makeNotFoundMessage } from '../utils/generators/messageGenerators';
import { Op } from 'sequelize';
import { Payment } from '../payments/payments.model';

@Injectable()
export class AccountsService {
  key32: Buffer;
  key16: Buffer;
  constructor(@InjectModel(Account) private accountRepository: typeof Account) {
    this.key32 = Buffer.from(process.env.KEY_32, 'hex');
    this.key16 = Buffer.from(process.env.KEY_16, 'hex');
  }

  async getAllAccounts() {
    const accounts: Account[] | null = await this.accountRepository.findAll({
      include: [{ model: Payment }],
    });

    if (accounts.length === 0) {
      throw new HttpException(makeNotFoundMessage('Accounts'), HttpStatus.NOT_FOUND);
    }

    const decryptedAccounts = accounts.map((account) => {
      const decryptedRoutingNumber = decrypt(account.routingNumber, this.key32, this.key16);
      const decryptedAccountNumber = decrypt(account.accountNumber, this.key32, this.key16);
      const decryptedPayment: Payment[] = account.payments
        ? JSON.parse(JSON.stringify(account.payments))
        : null;

      const decryptedAccount = {
        ...account.toJSON(),
        routingNumber: decryptedRoutingNumber,
        accountNumber: decryptedAccountNumber,
        payments: decryptedPayment,
      };

      return decryptedAccount;
    });

    return decryptedAccounts;
  }

  async getAccountById(id: number): Promise<Account | null> {
    const account: Account | null = await this.accountRepository.findByPk(id, {
      include: [{ model: Payment }],
    });

    if (!account) {
      throw new HttpException(makeNotFoundMessage('Account'), HttpStatus.NOT_FOUND);
    }

    const decryptedRoutingNumber = decrypt(account.routingNumber, this.key32, this.key16);
    const decryptedAccountNumber = decrypt(account.accountNumber, this.key32, this.key16);
    const decryptedPayment: Payment[] = account.payments
      ? JSON.parse(JSON.stringify(account.payments))
      : null;

    const decryptedAccount = {
      routingNumber: decryptedRoutingNumber,
      accountNumber: decryptedAccountNumber,
      payments: decryptedPayment,
    };

    account.setDataValue('routingNumber', decryptedAccount.routingNumber);
    account.setDataValue('accountNumber', decryptedAccount.accountNumber);

    return account;
  }

  async getAccountsByBusinessId(businessId: number): Promise<IGetAllAccountsResponse> {
    const accounts: Account[] | null = await this.accountRepository.findAll({
      where: {
        businessId: {
          [Op.in]: [businessId],
        },
      },
      include: [{ model: Payment }],
    });

    if (accounts.length === 0) {
      throw new HttpException(makeNotFoundMessage('Accounts'), HttpStatus.NOT_FOUND);
    }

    const decryptedAccounts = accounts.map((account) => {
      const decryptedRoutingNumber = decrypt(account.routingNumber, this.key32, this.key16);
      const decryptedAccountNumber = decrypt(account.accountNumber, this.key32, this.key16);
      const decryptedPayment: Payment[] = account.payments
        ? JSON.parse(JSON.stringify(account.payments))
        : null;

      const decryptedAccount = {
        ...account.toJSON(),
        routingNumber: decryptedRoutingNumber,
        accountNumber: decryptedAccountNumber,
        payments: decryptedPayment,
      };

      return decryptedAccount;
    });

    const response: IGetAllAccountsResponse = {
      status: HttpStatus.OK,
      data: decryptedAccounts as Account[],
    };
    return response;
  }

  async createNewAccount(dto: CreateAccountDto): Promise<IBasicAccountResponse> {
    const encryptedDto = {
      ...dto,
      routingNumber: encrypt(dto.routingNumber, this.key32, this.key16),
      accountNumber: encrypt(dto.accountNumber, this.key32, this.key16),
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
