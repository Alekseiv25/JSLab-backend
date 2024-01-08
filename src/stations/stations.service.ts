import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateStationDto } from './dto/create-station.dto';
import { Station } from './stations.model';
import { Account, StationAccount } from 'src/accounts/accounts.model';
import {
  makeAvailableMessage,
  makeConflictMessage,
  makeDeleteMessage,
  makeNotFoundMessage,
} from 'src/utils/generators/messageGenerators';
import * as crypto from 'crypto';
import * as fs from 'fs';
import {
  IBasicStationResponse,
  ICheckStationNameResponse,
  IDeleteStationResponse,
  IDeleteStationsResponse,
  IGetAllStationsResponse,
} from 'src/types/responses/stations';
import { decrypt } from 'src/utils/crypto';
import { Operation } from 'src/operations/operations.model';
import { OperationsService } from 'src/operations/operations.service';
import { FuelPrice } from 'src/fuel_prices/fuel_prices.model';
import { Transaction } from 'src/transactions/transactions.model';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { Payment } from 'src/payments/payments.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class StationsService {
  key32: Buffer;
  key16: Buffer;
  constructor(
    @InjectModel(Station) private stationRepository: typeof Station,
    @InjectModel(StationAccount) private stationAccountRepository: typeof StationAccount,
    private operationsService: OperationsService,
    private usersService: UsersService,
  ) {
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

  async getAllStations(): Promise<IGetAllStationsResponse> {
    const stations: Station[] | [] = await this.stationRepository.findAll({
      include: [
        { model: Account },
        { model: Operation },
        { model: FuelPrice },
        { model: Transaction },
        { model: Payment },
      ],
    });

    if (stations.length === 0) {
      throw new HttpException(makeNotFoundMessage('Stations'), HttpStatus.NOT_FOUND);
    }

    const response: IGetAllStationsResponse = { status: HttpStatus.OK, data: stations };
    return response;
  }

  async getStationsByBusinessId(
    businessId: number,
    searchQuery?: string,
    name?: string,
    address?: string,
    fromDate?: string,
    toDate?: string,
    limit?: number,
    page?: number,
  ): Promise<IGetAllStationsResponse> {
    const where: WhereOptions<Station> = {
      businessId: {
        [Op.in]: [businessId],
      },
    };

    if (searchQuery) {
      where[Op.or] = [
        { name: { [Op.like]: `%${searchQuery}%` } },
        { address: { [Op.like]: `%${searchQuery}%` } },
      ];
    }

    const conditions: WhereOptions<Station>[] = [];

    if (name) {
      const names = name.split(',').map((n) => ({ name: { [Op.like]: `%${n.trim()}%` } }));
      conditions.push({ [Op.or]: names });
    }

    if (address) {
      const addresses = address
        .split(',')
        .map((a) => ({ address: { [Op.like]: `%${a.trim()}%` } }));
      conditions.push({ [Op.or]: addresses });
    }

    if (conditions.length > 0) {
      where[Op.and] = conditions;
    } else {
      where[Op.and] = {};
    }

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

    const options: FindOptions = {
      where,
      include: [
        { model: Account },
        { model: Operation },
        { model: FuelPrice },
        { model: Transaction },
      ],
      order: [['id', 'DESC']],
    };

    if (limit && page) {
      const offset = (page - 1) * limit;
      options.limit = limit;
      options.offset = offset;
    } else if (limit) {
      options.limit = limit;
    }

    const stations: Station[] | null = await this.stationRepository.findAll(options);

    if (stations.length === 0) {
      throw new HttpException(makeNotFoundMessage('Stations'), HttpStatus.NOT_FOUND);
    }

    const totalCount = await this.stationRepository.count({ where });

    const response: IGetAllStationsResponse = {
      status: HttpStatus.OK,
      data: stations,
      totalCount,
    };

    return response;
  }

  async getStationById(id: number): Promise<IBasicStationResponse> {
    const station: Station | null = await this.stationRepository.findByPk(id, {
      include: [
        {
          model: Account,
        },
        { model: Operation, separate: true },
        { model: FuelPrice },
        { model: Transaction },
        { model: Payment },
      ],
    });

    if (!station) {
      throw new HttpException(makeNotFoundMessage('Station'), HttpStatus.NOT_FOUND);
    }

    const decryptedAccounts = await Promise.all(
      station.accounts.map(async (account) => {
        const decryptedRoutingNumber = decrypt(account.routingNumber, this.key32, this.key16);
        const decryptedAccountNumber = decrypt(account.accountNumber, this.key32, this.key16);
        const decryptedPayment = account.payments
          ? JSON.parse(JSON.stringify(account.payments))
          : null;
        const decryptedAccount = Account.build({
          ...account.get({ plain: true }),
          routingNumber: decryptedRoutingNumber,
          accountNumber: decryptedAccountNumber,
          payments: decryptedPayment,
        });
        decryptedAccount.isNewRecord = false;
        return decryptedAccount;
      }),
    );

    station.setDataValue('accounts', decryptedAccounts);
    const response: IBasicStationResponse = { status: HttpStatus.OK, data: station };
    return response;
  }

  async createNewStation(
    dto: CreateStationDto,
    userId: number,
  ): Promise<IBasicStationResponse | ICheckStationNameResponse> {
    const uniquenessResponse: ICheckStationNameResponse = await this.checkUniquenessOfName(
      dto.name,
    );

    if (uniquenessResponse.status !== 200) {
      return uniquenessResponse;
    }

    const newStation: Station = await this.stationRepository.create(dto);

    const createdAt: Date = new Date(newStation.createdAt);
    const yearOfCreation: string = createdAt.getFullYear().toString();
    const merchantId: string = `${newStation.name}-${newStation.id}`;
    const storeId: string = `${yearOfCreation}-${newStation.id}`;

    const station: Station = await newStation.update({
      ...newStation,
      merchantId: merchantId,
      storeId: storeId,
    });

    await this.usersService.addUserAssignToStation(userId, station.id, 'Admin');
    await this.operationsService.createNewOperation(station.id);
    await this.assignStationToAccount(station.id, dto.accountId);

    const response: IBasicStationResponse = { status: HttpStatus.OK, data: station };
    return response;
  }

  async updateStation(
    id: number,
    updatedStationDto: CreateStationDto,
  ): Promise<IBasicStationResponse> {
    const station: Station | null = await this.stationRepository.findOne({ where: { id } });

    if (!station) {
      throw new HttpException(makeNotFoundMessage('Station'), HttpStatus.NOT_FOUND);
    }

    const updatedStation: Station = await station.update(updatedStationDto);

    const response: IBasicStationResponse = { status: HttpStatus.OK, data: updatedStation };
    return response;
  }

  async deleteStation(id: number): Promise<IDeleteStationResponse> {
    const station: Station | null = await this.stationRepository.findByPk(id);

    if (!station) {
      throw new HttpException(makeNotFoundMessage('Station'), HttpStatus.NOT_FOUND);
    }

    await station.destroy();
    const response: IDeleteStationResponse = {
      status: HttpStatus.OK,
      message: makeDeleteMessage('Station'),
      data: station,
    };
    return response;
  }

  async deleteStations(ids: number[]): Promise<IDeleteStationsResponse> {
    const stations: Station[] = await this.stationRepository.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    if (stations.length === 0) {
      throw new HttpException(makeNotFoundMessage('Stations'), HttpStatus.NOT_FOUND);
    }

    await this.stationRepository.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    const response: IDeleteStationsResponse = {
      status: HttpStatus.OK,
      message: makeDeleteMessage('Stations'),
      data: stations,
    };
    return response;
  }

  async checkUniquenessOfName(name: string): Promise<ICheckStationNameResponse> {
    const stationWithThisName: Station | null = await this.stationRepository.findOne({
      where: { name },
    });

    if (stationWithThisName) {
      throw new HttpException(makeConflictMessage('Name'), HttpStatus.CONFLICT);
    }

    const response: ICheckStationNameResponse = {
      status: HttpStatus.OK,
      message: makeAvailableMessage('Name'),
    };
    return response;
  }

  async assignStationToAccount(stationId: number, accountId: number) {
    const stationAccountData = {
      stationId,
      accountId,
    };

    if (!stationAccountData) {
      throw new HttpException(makeConflictMessage('Account'), HttpStatus.CONFLICT);
    }

    await this.stationAccountRepository.create(stationAccountData);

    const response = {
      status: HttpStatus.OK,
    };
    return response;
  }
}
