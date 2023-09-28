import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateStationDto } from './dto/create-station.dto';
import { Station } from './stations.model';
import makeUniquenessResponseMessage from 'src/utils/messageGenerator';

@Injectable()
export class StationsService {
  constructor(@InjectModel(Station) private stationRepository: typeof Station) {}

  async getAllStations() {
    const stations = await this.stationRepository.findAll();
    return stations;
  }

  async createNewStation(dto: CreateStationDto) {
    try {
      const response = await this.checkUniquenessOfName(dto.name);
      const result = response.status === 200 ? await this.stationRepository.create(dto) : response;
      return result;
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
    const response = stationWithThisName
      ? { status: 409, message: makeUniquenessResponseMessage('Station Name', false) }
      : { status: 200, message: makeUniquenessResponseMessage('Station Name', true) };
    return response;
  }
}
