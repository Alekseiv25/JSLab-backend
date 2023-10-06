import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateStationDto } from './dto/create-station.dto';
import { Station } from './stations.model';
import { Account } from 'src/accounts/accounts.model';
import {
  makeDeleteMessage,
  makeNotFoundMessage,
  makeUniquenessResponseMessage,
} from 'src/utils/generators/messageGenerators';
import {
  IBasicStationResponse,
  ICheckStationEmailResponse,
  IDeleteStationResponse,
  IGetAllStationsResponse,
} from 'src/types/responses/stations';

@Injectable()
export class StationsService {
  constructor(@InjectModel(Station) private stationRepository: typeof Station) {}

  async getAllStations(): Promise<IGetAllStationsResponse> {
    const stations: Station[] | [] = await this.stationRepository.findAll({
      include: ['accounts'],
    });

    if (stations.length === 0) {
      throw new HttpException(makeNotFoundMessage('Stations'), HttpStatus.NOT_FOUND);
    }

    const response: IGetAllStationsResponse = { statusCode: HttpStatus.OK, data: stations };
    return response;
  }

  async getStationById(id: number): Promise<IBasicStationResponse> {
    const station: Station | null = await this.stationRepository.findByPk(id, {
      include: { model: Account },
    });

    if (!station) {
      throw new HttpException(makeNotFoundMessage('Stations'), HttpStatus.NOT_FOUND);
    }

    const response: IBasicStationResponse = { statusCode: HttpStatus.OK, data: station };
    return response;
  }

  async createNewStation(dto: CreateStationDto): Promise<IBasicStationResponse> {
    const uniquenessResponse: ICheckStationEmailResponse = await this.checkUniquenessOfName(
      dto.name,
    );

    if (uniquenessResponse.statusCode !== 200) {
      throw new HttpException(uniquenessResponse.message, HttpStatus.CONFLICT);
    }

    const newStation: Station = await this.stationRepository.create(dto);
    const response: IBasicStationResponse = { statusCode: HttpStatus.OK, data: newStation };
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
    const response: IBasicStationResponse = { statusCode: HttpStatus.OK, data: updatedStation };
    return response;
  }

  async deleteStation(id: number): Promise<IDeleteStationResponse> {
    const station: Station | null = await this.stationRepository.findByPk(id);

    if (!station) {
      throw new HttpException(makeNotFoundMessage('Station'), HttpStatus.NOT_FOUND);
    }

    await station.destroy();
    const response: IDeleteStationResponse = {
      statusCode: HttpStatus.OK,
      message: makeDeleteMessage('Station'),
      data: station,
    };
    return response;
  }

  async checkUniquenessOfName(name: string): Promise<ICheckStationEmailResponse> {
    const stationWithThisName: Station | null = await this.stationRepository.findOne({
      where: { name },
    });

    if (stationWithThisName) {
      throw new HttpException(makeUniquenessResponseMessage('Name', false), HttpStatus.CONFLICT);
    }

    const response: ICheckStationEmailResponse = {
      statusCode: HttpStatus.OK,
      message: makeUniquenessResponseMessage('Name', true),
    };
    return response;
  }
}
