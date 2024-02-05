import { CreateUsersStationsDto } from './dto/create-users_stations.dto';
import { UsersStations } from './users_stations.model';
import { Station } from '../stations/stations.model';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersStationsService {
  constructor(
    @InjectModel(UsersStations)
    private usersStationsRepository: typeof UsersStations,
  ) {}

  async createNewRecord(createDto: CreateUsersStationsDto): Promise<UsersStations> {
    const userStations: UsersStations = await this.usersStationsRepository.create(createDto);
    return userStations;
  }

  async findAllRecordsByUserId(userId: number): Promise<UsersStations[]> {
    const userStations: UsersStations[] = await this.usersStationsRepository.findAll({
      where: { userId: userId },
      include: [{ model: Station }],
    });

    return userStations;
  }

  async removeUserAssignToStation(stationId: number | null, userId: number | null): Promise<void> {
    if (stationId) {
      await this.usersStationsRepository.destroy({ where: { stationId: stationId } });
    } else {
      await this.usersStationsRepository.destroy({ where: { userId: userId } });
    }
  }
}
