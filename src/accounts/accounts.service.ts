import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Account } from './accounts.model';
import { CreateAccountDto } from './dto/create-account.dto';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { decrypt, encrypt } from '../utils/crypto';
import {
  IBasicAccountResponse,
  IDeleteAccountResponse,
  IGetAllAccountsResponse,
} from '../types/responses/accounts';
import { makeDeleteMessage, makeNotFoundMessage } from '../utils/generators/messageGenerators';
import { Op } from 'sequelize';
import { Payment } from 'src/payments/payments.model';

@Injectable()
export class AccountsService {
  key32: Buffer;
  key16: Buffer;
  constructor(@InjectModel(Account) private accountRepository: typeof Account) {
    const { key32, key16 } = this.loadEncryptionKeys();
    this.key32 = key32;
    this.key16 = key16;
  }

  private generateEncryptionKeys(): { key32: Buffer; key16: Buffer } {
    const key32 = crypto.randomBytes(32);
    const key16 = crypto.randomBytes(16);
    return { key32, key16 };
  }

  private saveEncryptionKeys(keys: { key32: Buffer; key16: Buffer }): void {
    const config = {
      key32: keys.key32.toString('hex'),
      key16: keys.key16.toString('hex'),
    };
    fs.writeFileSync('keys.json', JSON.stringify(config));
  }

  private loadEncryptionKeys(): { key32: Buffer; key16: Buffer } {
    try {
      const config = JSON.parse(fs.readFileSync('keys.json', 'utf8'));
      const key32String = config.key32;
      const key16String = config.key16;
      return {
        key32: Buffer.from(key32String, 'hex'),
        key16: Buffer.from(key16String, 'hex'),
      };
    } catch (error) {
      const newKeys = this.generateEncryptionKeys();
      this.saveEncryptionKeys(newKeys);
      return newKeys;
    }
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
