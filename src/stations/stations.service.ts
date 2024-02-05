import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateStationDto } from './dto/create-station.dto';
import { Station } from './stations.model';
import { Account, StationAccount } from '../accounts/accounts.model';
import {
  makeAvailableMessage,
  makeConflictMessage,
  makeDeleteMessage,
  makeNotFoundMessage,
} from '../utils/generators/messageGenerators';
import {
  IBasicStationResponse,
  ICheckStationNameResponse,
  IDeleteStationResponse,
  IDeleteStationsResponse,
  IGetAllStationsResponse,
  IGetStationResponse,
} from '../types/responses/stations';
import { decrypt } from '../utils/crypto';
import { Operation } from '../operations/operations.model';
import { OperationsService } from '../operations/operations.service';
import { FuelPrice } from '../fuel_prices/fuel_prices.model';
import { Transaction } from '../transactions/transactions.model';
import { FindOptions, Op, WhereOptions } from 'sequelize';
import { Payment } from '../payments/payments.model';
import { UsersService } from '../users/users.service';
import { UsersStationsService } from '../users_stations/users_stations.service';
import { UsersStations } from '../users_stations/users_stations.model';
import {
  IGlobalSearchStationsResponse,
  IStationsDataForGlobalSearch,
} from '../types/responses/globalSEarch';
import { applyPaginationOptions, calculateAmountOfPages } from '../utils/pagination';

@Injectable()
export class StationsService {
  key32: Buffer;
  key16: Buffer;
  constructor(
    @InjectModel(Station) private stationRepository: typeof Station,
    @InjectModel(StationAccount) private stationAccountRepository: typeof StationAccount,
    private operationsService: OperationsService,
    private usersService: UsersService,
    private usersStationsService: UsersStationsService,
  ) {
    this.key32 = Buffer.from(process.env.KEY_32, 'hex');
    this.key16 = Buffer.from(process.env.KEY_16, 'hex');
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

    const response: IGetAllStationsResponse = {
      status: HttpStatus.OK,
      data: { stations: stations },
    };
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

    if (conditions.length > 0) {
      where[Op.and] = conditions;
    } else {
      where[Op.and] = {};
    }

    const options: FindOptions = {
      where,
      include: [
        { model: Account },
        { model: Operation },
        { model: FuelPrice },
        { model: Transaction },
        { model: Payment },
      ],
      order: [['id', 'DESC']],
    };

    applyPaginationOptions(options, limit, page);
    const stations: Station[] | null = await this.stationRepository.findAll(options);

    if (stations.length === 0) {
      throw new HttpException(makeNotFoundMessage('Stations'), HttpStatus.NOT_FOUND);
    }

    const totalCount = await this.stationRepository.count({ where });

    const response: IGetAllStationsResponse = {
      status: HttpStatus.OK,
      data: { stations: stations, params: { totalCount } },
    };

    return response;
  }

  async getStationsByUserId(
    userId: number,
    searchQuery?: string,
    name?: string,
    address?: string,
    fromDate?: string,
    toDate?: string,
    limit?: number,
    page?: number,
  ): Promise<IGetAllStationsResponse> {
    const userStations: UsersStations[] =
      await this.usersStationsService.findAllRecordsByUserId(userId);
    const userStationsIds = userStations.map((usersStations) => usersStations.dataValues.stationId);

    const where: WhereOptions<Station> = {
      id: {
        [Op.in]: userStationsIds,
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

    if (conditions.length > 0) {
      where[Op.and] = conditions;
    } else {
      where[Op.and] = {};
    }

    const options: FindOptions = {
      where,
      include: [
        { model: Account },
        { model: Operation },
        { model: FuelPrice },
        { model: Transaction },
        { model: Payment },
      ],
      order: [['id', 'DESC']],
    };
    applyPaginationOptions(options, limit, page);

    const stations: Station[] | null = await this.stationRepository.findAll(options);

    if (!userStationsIds) {
      throw new HttpException(makeNotFoundMessage('Stations'), HttpStatus.NOT_FOUND);
    }

    const totalCount = await this.stationRepository.count({ where });
    const amountOfPages = calculateAmountOfPages(totalCount, limit);
    const currentPage = page;

    const response: IGetAllStationsResponse = {
      status: HttpStatus.OK,
      data: {
        stations: stations,
        params: {
          totalCount,
          amountOfPages,
          currentPage,
        },
      },
    };

    return response;
  }

  async getStationById(id: number, userId: number): Promise<IGetStationResponse> {
    const station: Station | null = await this.stationRepository.findByPk(id, {
      include: [
        { model: Account },
        { model: Operation, separate: true },
        { model: FuelPrice },
        { model: Transaction },
        { model: Payment },
      ],
    });

    if (!station) {
      throw new HttpException(makeNotFoundMessage('Station'), HttpStatus.NOT_FOUND);
    }

    const userStations: UsersStations[] =
      await this.usersStationsService.findAllRecordsByUserId(userId);

    const userStation: UsersStations | undefined = userStations.find(
      (userStation) => userStation.dataValues.stationId === Number(id),
    );

    const userStatus: string = userStation.dataValues.role;

    if (!userStations.some((userStation) => userStation.dataValues.stationId === Number(id))) {
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

    const stationResponse = { station: station, userStatus: userStatus };

    const response: IGetStationResponse = { status: HttpStatus.OK, data: stationResponse };
    return response;
  }

  async getStationsBySearchValue(
    userId: number,
    searchValue: string,
    currentPage: number,
    itemsPerPage: number,
  ): Promise<IGlobalSearchStationsResponse> {
    const userStations: UsersStations[] = await this.usersService.findUserStations(userId);

    const stationsData: IStationsDataForGlobalSearch[] = [];
    const amountOfStations: number = userStations.length;

    const amountOfPages: number = Math.ceil(amountOfStations / itemsPerPage);
    const startIndex: number = (currentPage - 1) * itemsPerPage;
    const endIndex: number = currentPage * itemsPerPage;

    for (let i = startIndex; i < endIndex && i < amountOfStations; i++) {
      const station = userStations[i];

      if (station.station.name.toLowerCase().includes(searchValue.toLowerCase())) {
        const stationObject: IStationsDataForGlobalSearch = {
          id: station.station.id,
          name: station.station.name,
          address: station.station.address,
          phone: station.station.phone,
          openStatus: true,
        };

        stationsData.push(stationObject);
      }
    }

    const response: IGlobalSearchStationsResponse = {
      status: HttpStatus.OK,
      data: {
        stations: stationsData,
        params: { amountOfStations, amountOfPages, currentPage },
      },
    };
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

    await this.usersService.removeUserAssignOnStation(id);
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
    for (const station of stations) await this.usersService.removeUserAssignOnStation(station.id);

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

  async findStationById(id: number): Promise<Station> {
    const station: Station | null = await this.stationRepository.findByPk(id);

    if (!station) {
      throw new HttpException(makeNotFoundMessage('Stations'), HttpStatus.NOT_FOUND);
    }

    return station;
  }
}
