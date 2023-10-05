import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateStationDto } from './dto/create-station.dto';
import { Station } from './stations.model';
import { Account } from 'src/accounts/accounts.model';
import { IResponseStationDataObject } from 'src/types/responses';
import { generateStationFoundResponse } from 'src/utils/generators/responseObjectsGenerators';
import makeUniquenessResponseMessage from 'src/utils/generators/messageGenerators';

const NOT_FOUND_MESSAGE = 'The station was not found in the database!';
const SERVER_ERROR_MESSAGE = 'Oops... Internal server error';

@Injectable()
export class StationsService {
  constructor(@InjectModel(Station) private stationRepository: typeof Station) {}

  async getAllStations() {
    const stations = await this.stationRepository.findAll({
      include: [
        {
          model: Account,
          as: 'accounts',
        },
      ],
    });
    return stations;
  }

  async getStationById(id: number): Promise<HttpException | IResponseStationDataObject> {
    try {
      const station: Station = await this.stationRepository.findByPk(id, {
        include: { model: Account },
      });

      if (!station) {
        throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }

      const response = generateStationFoundResponse(station);
      return response;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      } else {
        console.warn(error);
        throw new HttpException(SERVER_ERROR_MESSAGE, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async createNewStation(dto: CreateStationDto) {
    try {
      const response = await this.checkUniquenessOfName(dto.name);
      if (response.status === 200) {
        const newStation = await this.stationRepository.create(dto);
        return newStation;
      } else {
        return response;
      }
    } catch (error) {
      console.error(error);
      return { status: 500, message: 'Internal server error' };
    }
  }

  async updateStation(id: number, dto: CreateStationDto) {
    const station = await this.stationRepository.findOne({ where: { id } });

    if (!station) {
      throw new NotFoundException(`Business with such id - ${id}, not found!`);
    }

    await station.update(dto);
    return station;
  }

  async deleteStation(id: number) {
    const station = await this.stationRepository.findByPk(id);

    if (!station) {
      throw new NotFoundException(`Station with ID ${id} not found!`);
    }

    await station.destroy();
    return { message: `Station with ID ${id} has been deleted...` };
  }

  async checkUniquenessOfName(name: string) {
    const stationWithThisName = await this.stationRepository.findOne({ where: { name } });
    if (stationWithThisName) {
      return { status: 409, message: makeUniquenessResponseMessage('Station Name', false) };
    } else {
      return { status: 200, message: makeUniquenessResponseMessage('Station Name', true) };
    }
  }
}
