import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from './businesses.model';
import { CreateBusinessDto } from './dto/create-business.dto';
import { DuplicateValueExeption } from '../exceptions/exception';

@Injectable()
export class BusinessesService {
  constructor(@InjectModel(Business) private businessRepository: typeof Business) {}

  async getAllBusinesses() {
    const business = await this.businessRepository.findAll();
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

  async updateBusiness(legalName: string, updatedBusinessDto) {
    const business = await this.businessRepository.findOne({ where: { legalName } });

    if (!business) {
      throw new NotFoundException(`Business with such legal name - ${legalName}, not found!`);
    }

    await business.update(updatedBusinessDto);
    return business;
  }

  async deleteBusiness(legalName: string) {
    const business = await this.businessRepository.findOne({ where: { legalName } });

    if (!business) {
      throw new NotFoundException(`Business with such legal name - ${legalName}, not found!`);
    }

    await business.destroy();
    return { message: `Business with with legal name - ${legalName}, has been deleted...` };
  }

  async checkIsBusinessNameUnique(legalName) {
    const business = await this.businessRepository.findOne({ where: { legalName } });
    const isBusinessNameUnique = business ? false : true;
    return isBusinessNameUnique;
  }
}
