import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateStationDto } from './dto/create-station.dto';
import { Station } from './stations.model';
import { Account } from 'src/accounts/accounts.model';
import { makeDeleteMessage } from 'src/utils/generators/messageGenerators';
import { IBasicResponse } from 'src/types/responses';
import {
  IBasicStationResponse,
  ICheckStationEmailResponse,
  IDeleteStationResponse,
  IGetAllStationsResponse,
} from 'src/types/responses/stations';
import {
  generateAvailableResponse,
  generateConflictResponse,
  generateNotFoundResponse,
} from 'src/utils/generators/responseObjectGenerators';

@Injectable()
export class StationsService {
  constructor(@InjectModel(Station) private stationRepository: typeof Station) {}

  async getAllStations(): Promise<IGetAllStationsResponse | IBasicResponse> {
    const stations: Station[] | [] = await this.stationRepository.findAll({
      include: ['accounts'],
    });

    if (stations.length === 0) {
      const response: IBasicResponse = generateNotFoundResponse('Stations');
      return response;
    }

    const response: IGetAllStationsResponse = { statusCode: HttpStatus.OK, data: stations };
    return response;
  }

  async getStationById(id: number): Promise<IBasicStationResponse | IBasicResponse> {
    const station: Station | null = await this.stationRepository.findByPk(id, {
      include: { model: Account },
    });

    if (!station) {
      const response: IBasicResponse = generateNotFoundResponse('Station');
      return response;
    }

    const response: IBasicStationResponse = { statusCode: HttpStatus.OK, data: station };
    return response;
  }

  async createNewStation(
    dto: CreateStationDto,
  ): Promise<IBasicStationResponse | ICheckStationEmailResponse> {
    const uniquenessResponse: ICheckStationEmailResponse = await this.checkUniquenessOfName(
      dto.name,
    );

    if (uniquenessResponse.statusCode !== 200) {
      return uniquenessResponse;
    }

    const newStation: Station = await this.stationRepository.create(dto);
    const response: IBasicStationResponse = { statusCode: HttpStatus.OK, data: newStation };
    return response;
  }

  async updateStation(
    id: number,
    updatedStationDto: CreateStationDto,
  ): Promise<IBasicStationResponse | IBasicResponse> {
    const station: Station | null = await this.stationRepository.findOne({ where: { id } });

    if (!station) {
      const response: IBasicResponse = generateNotFoundResponse('Station');
      return response;
    }

    const updatedStation: Station = await station.update(updatedStationDto);
    const response: IBasicStationResponse = { statusCode: HttpStatus.OK, data: updatedStation };
    return response;
  }

  async deleteStation(id: number): Promise<IDeleteStationResponse | IBasicResponse> {
    const station: Station | null = await this.stationRepository.findByPk(id);

    if (!station) {
      const response: IBasicResponse = generateNotFoundResponse('Station');
      return response;
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
      const response: IBasicResponse = generateConflictResponse('Name');
      return response;
    }

    const response: IBasicResponse = generateAvailableResponse('Name');
    return response;
  }
}
