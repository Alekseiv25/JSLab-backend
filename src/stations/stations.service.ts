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
import {
  IBasicStationResponse,
  ICheckStationNameResponse,
  IDeleteStationResponse,
  IGetAllStationsResponse,
} from 'src/types/responses/stations';

@Injectable()
export class StationsService {
  constructor(
    @InjectModel(Station) private stationRepository: typeof Station,
    @InjectModel(StationAccount) private stationAccountRepository: typeof StationAccount,
  ) {}

  async getAllStations(): Promise<IGetAllStationsResponse> {
    const stations: Station[] | [] = await this.stationRepository.findAll({
      include: ['accounts'],
    });

    if (stations.length === 0) {
      throw new HttpException(makeNotFoundMessage('Stations'), HttpStatus.NOT_FOUND);
    }

    const response: IGetAllStationsResponse = { status: HttpStatus.OK, data: stations };
    return response;
  }

  async getStationById(id: number): Promise<IBasicStationResponse> {
    const station: Station | null = await this.stationRepository.findByPk(id, {
      include: { model: Account },
    });

    if (!station) {
      throw new HttpException(makeNotFoundMessage('Station'), HttpStatus.NOT_FOUND);
    }

    const response: IBasicStationResponse = { status: HttpStatus.OK, data: station };
    return response;
  }

  async createNewStation(
    dto: CreateStationDto,
  ): Promise<IBasicStationResponse | ICheckStationNameResponse> {
    const uniquenessResponse: ICheckStationNameResponse = await this.checkUniquenessOfName(
      dto.name,
    );

    if (uniquenessResponse.status !== 200) {
      return uniquenessResponse;
    }
    const newStation: Station = await this.stationRepository.create(dto);

    await this.assignStationToAccount(newStation.id, dto.accountId);

    const response: IBasicStationResponse = { status: HttpStatus.OK, data: newStation };
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
    await this.stationAccountRepository.create(stationAccountData);
  }
}
