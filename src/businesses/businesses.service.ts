import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from './businesses.model';
import { CreateBusinessDto } from './dto/create-business.dto';
import { DuplicateValueExeption } from '../Exceptions/exceptions';
import { Station } from 'src/stations/stations.model';

@Injectable()
export class BusinessesService {
  constructor(@InjectModel(Business) private businessRepository: typeof Business) {}

  async getAllBusinesses() {
    const business = await this.businessRepository.findAll({
      include: [
        'users',
        {
          model: Station,
          as: 'stations',
        },
      ],
    });
    return business;
  }

  async createNewBusiness(dto: CreateBusinessDto) {
    const isBusinessNameUnique = await this.checkIsBusinessNameUnique(dto.legalName);

    if (!isBusinessNameUnique) {
      throw new DuplicateValueExeption('Legal Name');
    }

    const business = await this.businessRepository.create(dto);
    return business;
  }

  async updateBusiness(id: number, dto) {
    const business = await this.businessRepository.findOne({ where: { id } });

    if (!business) {
      throw new NotFoundException(`Business with such id - ${id}, not found!`);
    }

    await business.update(dto);
    return business;
  }

  async deleteBusiness(id: number) {
    const business = await this.businessRepository.findOne({ where: { id } });

    if (!business) {
      throw new NotFoundException(`Business with such id - ${id}, not found!`);
    }

    await business.destroy();
    return { message: `Business with with id - ${id}, has been deleted...` };
  }

  async checkIsBusinessNameUnique(legalName: string) {
    const businessWithThisName = await this.businessRepository.findOne({ where: { legalName } });
    return !businessWithThisName;
  }
}
