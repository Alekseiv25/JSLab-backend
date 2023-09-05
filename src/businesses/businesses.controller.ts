import { Controller, Body, Param, Get, Post, Put, Delete } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';

@Controller('businesses')
export class BusinessesController {
  constructor(private businessesService: BusinessesService) {}

  @Get()
  getAllBusinesses() {
    return this.businessesService.getAllBusinesses();
  }

  @Post()
  createNewBusiness(@Body() businessDto: CreateBusinessDto) {
    return this.businessesService.createNewBusiness(businessDto);
  }

  @Put(':legalName')
  updateBusiness(
    @Param('legalName') legalName: string,
    @Body() updatedBusinessDto: CreateBusinessDto,
  ) {
    return this.businessesService.updateBusiness(legalName, updatedBusinessDto);
  }

  @Delete(':legalName')
  deleteBusiness(@Param('legalName') legalName: string) {
    return this.businessesService.deleteBusiness(legalName);
  }
}
