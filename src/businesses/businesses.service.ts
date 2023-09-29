import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from './businesses.model';
import { CreateBusinessDto } from './dto/create-business.dto';
import { Station } from 'src/stations/stations.model';
import makeUniquenessResponseMessage from 'src/utils/messageGenerator';

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
    try {
      const response = await this.checkUniquenessOfName(dto.legalName);
      if (response.status === 200) {
        const newBusiness = await this.businessRepository.create(dto);
        return newBusiness;
      } else {
        return response;
      }
    } catch (error) {
      console.error(error);
      return { status: 500, message: 'Internal server error' };
    }
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

  async checkUniquenessOfName(legalName: string) {
    const businessWithThisName = await this.businessRepository.findOne({ where: { legalName } });
    if (businessWithThisName) {
      return { status: 409, message: makeUniquenessResponseMessage('Legal Name', false) };
    } else {
      return { status: 200, message: makeUniquenessResponseMessage('Legal Name', true) };
    }
  }
}
