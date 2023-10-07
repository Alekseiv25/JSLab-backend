import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from './businesses.model';
import { CreateBusinessDto } from './dto/create-business.dto';
import { makeDeleteMessage } from 'src/utils/generators/messageGenerators';
import { IBasicResponse } from 'src/types/responses';
import {
  IBasicBusinessResponse,
  ICheckBusinessNameResponse,
  IDeleteBusinessResponse,
  IGetAllBusinessResponse,
} from 'src/types/responses/businesses';
import {
  generateAvailableResponse,
  generateConflictResponse,
  generateNotFoundResponse,
} from 'src/utils/generators/responseObjectGenerators';

@Injectable()
export class BusinessesService {
  constructor(@InjectModel(Business) private businessRepository: typeof Business) {}

  async getAllBusinesses(): Promise<IGetAllBusinessResponse | IBasicResponse> {
    const businesses: Business[] | [] = await this.businessRepository.findAll({
      include: ['users', 'stations'],
    });

    if (businesses.length === 0) {
      const response: IBasicResponse = generateNotFoundResponse('Businesses');
      return response;
    }

    const response: IGetAllBusinessResponse = { statusCode: HttpStatus.OK, data: businesses };
    return response;
  }

  async createNewBusiness(
    dto: CreateBusinessDto,
  ): Promise<IBasicBusinessResponse | IBasicResponse> {
    const uniquenessResponse: ICheckBusinessNameResponse = await this.checkUniquenessOfName(
      dto.legalName,
    );

    if (uniquenessResponse.statusCode !== 200) {
      return uniquenessResponse;
    }

    const newBusiness: Business = await this.businessRepository.create(dto);
    const response: IBasicBusinessResponse = { statusCode: HttpStatus.OK, data: newBusiness };
    return response;
  }

  async updateBusiness(
    id: number,
    updatedBusinessDto: CreateBusinessDto,
  ): Promise<IBasicBusinessResponse | IBasicResponse> {
    const business: Business | null = await this.businessRepository.findOne({ where: { id } });

    if (!business) {
      const response: IBasicResponse = generateNotFoundResponse('Business');
      return response;
    }

    const updatedBusiness: Business = await business.update(updatedBusinessDto);
    const response: IBasicBusinessResponse = { statusCode: HttpStatus.OK, data: updatedBusiness };
    return response;
  }

  async deleteBusiness(id: number): Promise<IDeleteBusinessResponse | IBasicResponse> {
    const business: Business | null = await this.businessRepository.findOne({ where: { id } });

    if (!business) {
      const response: IBasicResponse = generateNotFoundResponse('Business');
      return response;
    }

    await business.destroy();
    const response: IDeleteBusinessResponse = {
      statusCode: HttpStatus.OK,
      message: makeDeleteMessage('Business'),
      data: business,
    };
    return response;
  }

  async checkUniquenessOfName(
    legalName: string,
  ): Promise<ICheckBusinessNameResponse | IBasicResponse> {
    const businessWithThisName: Business | null = await this.businessRepository.findOne({
      where: { legalName },
    });

    if (businessWithThisName) {
      const response: IBasicResponse = generateConflictResponse('Name');
      return response;
    }

    const response: IBasicResponse = generateAvailableResponse('Name');
    return response;
  }
}
