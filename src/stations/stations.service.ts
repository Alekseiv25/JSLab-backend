import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateStationDto } from './dto/create-station.dto';
import { Station } from './stations.model';
import { DuplicateValueExeption } from 'src/Exceptions/exceptions';

@Injectable()
export class StationsService {
  constructor(@InjectModel(Station) private stationRepository: typeof Station) {}

  async getAllStations() {
    const stations = await this.stationRepository.findAll();
    return stations;
  }

  async createNewStation(dto: CreateStationDto) {
    const isStationNameUnique = await this.checkUniquenessOfStationName(dto.name);

    if (!isStationNameUnique) {
      throw new DuplicateValueExeption('name');
    }

    const station = await this.stationRepository.create(dto);
    return station;
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

  async checkUniquenessOfStationName(name: string) {
    const stationWithThisName = await this.stationRepository.findOne({ where: { name } });
    return !stationWithThisName;
  }
}
