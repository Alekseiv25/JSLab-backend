import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Account } from './accounts.model';
import { CreateAccountDto } from './dto/create-account.dto';
import * as crypto from 'crypto';
import { decrypt, encrypt } from 'src/utils/crypto';
import { IBasicAccountResponse, IDeleteAccountResponse } from 'src/types/responses/accounts';
import { makeDeleteMessage } from 'src/utils/generators/messageGenerators';
import { generateNotFoundResponse } from 'src/utils/generators/responseObjectGenerators';
import { IBasicResponse } from 'src/types/responses';

@Injectable()
export class AccountsService {
  key: Buffer;
  constructor(@InjectModel(Account) private accountRepository: typeof Account) {
    this.key = crypto.randomBytes(32);
  }

  async getAllAccounts() {
    const accounts: Account[] | null = await this.accountRepository.findAll();

    if (accounts.length === 0) {
      const response: IBasicResponse = generateNotFoundResponse('Accounts');
      return response;
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

  async createNewAccount(dto: CreateAccountDto): Promise<IBasicAccountResponse> {
    const encryptedDto = {
      ...dto,
      routingNumber: encrypt(dto.routingNumber, this.key),
      accountNumber: encrypt(dto.accountNumber, this.key),
    };

    const newAccount: Account = await this.accountRepository.create(encryptedDto);
    const response: IBasicAccountResponse = { statusCode: HttpStatus.OK, data: newAccount };
    return response;
  }

  async updateAccount(
    id: number,
    dto: CreateAccountDto,
  ): Promise<IBasicAccountResponse | IBasicResponse> {
    const account: Account | null = await this.accountRepository.findOne({ where: { id } });

    if (!account) {
      const response: IBasicResponse = generateNotFoundResponse('Account');
      return response;
    }

    const updatedAccount: Account = await account.update(dto);
    const response: IBasicAccountResponse = { statusCode: HttpStatus.OK, data: updatedAccount };
    return response;
  }

  async deleteAccount(id: number): Promise<IDeleteAccountResponse | IBasicResponse> {
    const account: Account | null = await this.accountRepository.findByPk(id);

    if (!account) {
      const response: IBasicResponse = generateNotFoundResponse('Account');
      return response;
    }

    await account.destroy();
    const response: IDeleteAccountResponse = {
      statusCode: HttpStatus.OK,
      message: makeDeleteMessage('Account'),
      data: account,
    };
    return response;
  }
}
