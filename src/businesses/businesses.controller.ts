import { Controller, Body, Param, Get, Post, Put, Delete, HttpCode } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { IBasicResponse } from 'src/types/responses';
import {
  IBasicBusinessResponse,
  ICheckBusinessNameResponse,
  IDeleteBusinessResponse,
  IGetAllBusinessResponse,
} from 'src/types/responses/businesses';

@Controller('businesses')
export class BusinessesController {
  constructor(private businessesService: BusinessesService) {}

  @Get()
  getAllBusinesses(): Promise<IGetAllBusinessResponse | IBasicResponse> {
    return this.businessesService.getAllBusinesses();
  }

  @Post()
  createNewBusiness(
    @Body() businessDto: CreateBusinessDto,
  ): Promise<IBasicBusinessResponse | IBasicResponse> {
    return this.businessesService.createNewBusiness(businessDto);
  }

  @Post('name-uniqueness')
  @HttpCode(200)
  async checkUniquenessOfBusinessName(
    @Body('name') name: string,
  ): Promise<ICheckBusinessNameResponse> {
    return this.businessesService.checkUniquenessOfName(name);
  }

  @Put(':id')
  updateBusiness(
    @Param('id') id: number,
    @Body() updatedData: CreateBusinessDto,
  ): Promise<IBasicBusinessResponse | IBasicResponse> {
    return this.businessesService.updateBusiness(id, updatedData);
  }

  @Delete(':id')
  deleteBusiness(@Param('id') id: number): Promise<IDeleteBusinessResponse | IBasicResponse> {
    return this.businessesService.deleteBusiness(id);
  }
}
