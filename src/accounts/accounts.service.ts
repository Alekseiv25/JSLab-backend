import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Account } from './accounts.model';
import { CreateAccountDto } from './dto/create-account.dto';
import * as crypto from 'crypto';
import { decrypt, encrypt } from 'src/utils/crypto';

@Injectable()
export class AccountsService {
  key: Buffer;
  constructor(@InjectModel(Account) private accountRepository: typeof Account) {
    this.key = crypto.randomBytes(32);
  }

  async getAllAccounts() {
    const accounts = await this.accountRepository.findAll();
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

  async createNewAccount(dto: CreateAccountDto) {
    try {
      const encryptedDto = {
        ...dto,
        routingNumber: encrypt(dto.routingNumber, this.key),
        accountNumber: encrypt(dto.accountNumber, this.key),
      };

      const newAccount = await this.accountRepository.create(encryptedDto);
      return newAccount;
    } catch (error) {
      console.error(error);
      return { status: 500, message: 'Internal server error' };
    }
  }

  async updateAccount(id: number, dto: CreateAccountDto) {
    const account = await this.accountRepository.findOne({ where: { id } });

    if (!account) {
      throw new NotFoundException(`Account with such id - ${id}, not found!`);
    }

    await account.update(dto);
    return account;
  }

  async deleteAccount(id: number) {
    const account = await this.accountRepository.findByPk(id);

    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found!`);
    }

    await account.destroy();
    return { message: `Account with ID ${id} has been deleted...` };
  }
}
