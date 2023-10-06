import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Business } from './businesses.model';
import { CreateBusinessDto } from './dto/create-business.dto';
import {
  makeDeleteMessage,
  makeNotFoundMessage,
  makeUniquenessResponseMessage,
} from 'src/utils/generators/messageGenerators';
import {
  IBasicBusinessResponse,
  ICheckBusinessNameResponse,
  IDeleteBusinessResponse,
  IGetAllBusinessResponse,
} from 'src/types/responses/businesses';

@Injectable()
export class BusinessesService {
  constructor(@InjectModel(Business) private businessRepository: typeof Business) {}

  async getAllBusinesses(): Promise<IGetAllBusinessResponse> {
    const businesses: Business[] | [] = await this.businessRepository.findAll({
      include: ['users', 'stations'],
    });

    if (businesses.length === 0) {
      throw new HttpException(makeNotFoundMessage('Businesses'), HttpStatus.NOT_FOUND);
    }

    const response: IGetAllBusinessResponse = { statusCode: HttpStatus.OK, data: businesses };
    return response;
  }

  async createNewBusiness(dto: CreateBusinessDto): Promise<IBasicBusinessResponse> {
    const uniquenessResponse: ICheckBusinessNameResponse = await this.checkUniquenessOfName(
      dto.legalName,
    );

    if (uniquenessResponse.statusCode !== 200) {
      throw new HttpException(uniquenessResponse.message, HttpStatus.CONFLICT);
    }

    const newBusiness: Business = await this.businessRepository.create(dto);
    const response: IBasicBusinessResponse = { statusCode: HttpStatus.OK, data: newBusiness };
    return response;
  }

  async updateBusiness(
    id: number,
    updatedBusinessDto: CreateBusinessDto,
  ): Promise<IBasicBusinessResponse> {
    const business: Business | null = await this.businessRepository.findOne({ where: { id } });

    if (!business) {
      throw new HttpException(makeNotFoundMessage('Business'), HttpStatus.NOT_FOUND);
    }

    const updatedBusiness: Business = await business.update(updatedBusinessDto);
    const response: IBasicBusinessResponse = { statusCode: HttpStatus.OK, data: updatedBusiness };
    return response;
  }

  async deleteBusiness(id: number): Promise<IDeleteBusinessResponse> {
    const business: Business | null = await this.businessRepository.findOne({ where: { id } });

    if (!business) {
      throw new HttpException(makeNotFoundMessage('Business'), HttpStatus.NOT_FOUND);
    }

    await business.destroy();
    const response: IDeleteBusinessResponse = {
      statusCode: HttpStatus.OK,
      message: makeDeleteMessage('Business'),
      data: business,
    };
    return response;
  }

  async checkUniquenessOfName(legalName: string): Promise<ICheckBusinessNameResponse> {
    const businessWithThisName: Business | null = await this.businessRepository.findOne({
      where: { legalName },
    });

    if (businessWithThisName) {
      throw new HttpException(makeUniquenessResponseMessage('Name', false), HttpStatus.CONFLICT);
    }

    const response: ICheckBusinessNameResponse = {
      statusCode: HttpStatus.OK,
      message: makeUniquenessResponseMessage('Name', true),
    };
    return response;
  }
}
