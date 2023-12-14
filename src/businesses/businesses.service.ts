import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { IBasicResponse } from 'src/types/responses';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from './businesses.model';
import {
  makeAvailableMessage,
  makeConflictMessage,
  makeDeleteMessage,
  makeNotFoundMessage,
} from 'src/utils/generators/messageGenerators';
import {
  IBasicBusinessResponse,
  IDeleteBusinessResponse,
  IGetAllBusinessResponse,
} from 'src/types/responses/businesses';

@Injectable()
export class BusinessesService {
  constructor(@InjectModel(Business) private businessRepository: typeof Business) {}

  async getAllBusinesses(): Promise<IGetAllBusinessResponse> {
    const businesses: Business[] | [] = await this.businessRepository.findAll({
      include: ['users', 'stations', 'accounts', 'transactions'],
    });

    if (businesses.length === 0) {
      throw new HttpException(makeNotFoundMessage('Businesses'), HttpStatus.NOT_FOUND);
    }

    const response: IGetAllBusinessResponse = { status: HttpStatus.OK, data: businesses };
    return response;
  }

  async getBusinessByID(id: number): Promise<IBasicBusinessResponse> {
    const business: Business = await this.findBusinessByID(id);
    const response: IBasicBusinessResponse = { status: HttpStatus.OK, data: business };
    return response;
  }

  async createNewBusiness(dto: CreateBusinessDto): Promise<IBasicBusinessResponse> {
    await this.checkIsNameUnique(dto.legalName);
    const newBusiness: Business = await this.businessRepository.create(dto);
    const response: IBasicBusinessResponse = { status: HttpStatus.OK, data: newBusiness };
    return response;
  }

  async updateBusiness(
    id: number,
    updatedData: CreateBusinessDto,
  ): Promise<IBasicBusinessResponse> {
    const business: Business = await this.findBusinessByID(id);
    const updatedBusiness: Business = await business.update(updatedData);
    const response: IBasicBusinessResponse = { status: HttpStatus.OK, data: updatedBusiness };
    return response;
  }

  async deleteBusiness(id: number): Promise<IDeleteBusinessResponse> {
    const business: Business = await this.findBusinessByID(id);
    await business.destroy();
    const response: IDeleteBusinessResponse = {
      status: HttpStatus.OK,
      message: makeDeleteMessage('Business'),
      data: business,
    };
    return response;
  }

  async checkUniquenessOfName(legalName: string): Promise<IBasicResponse> {
    await this.checkIsNameUnique(legalName);
    const response: IBasicResponse = {
      status: HttpStatus.OK,
      message: makeAvailableMessage('Name'),
    };
    return response;
  }

  async checkIsNameUnique(businessNameForCheck: string): Promise<boolean> {
    const businessWithThisName: Business | null = await this.businessRepository.findOne({
      where: { legalName: businessNameForCheck },
    });

    if (businessWithThisName) {
      throw new HttpException(makeConflictMessage('Name'), HttpStatus.CONFLICT);
    }

    return true;
  }

  async findBusinessByID(businessID: number): Promise<Business> {
    const business: Business | null = await this.businessRepository.findByPk(businessID);

    if (!business) {
      throw new HttpException(makeNotFoundMessage('Business'), HttpStatus.NOT_FOUND);
    }

    return business;
  }
}
