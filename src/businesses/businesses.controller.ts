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

  @Post('check-name-uniqueness')
  async checkUniquenessOfBusinessName(@Body('name') name: string) {
    const isLegalNameUnique = await this.businessesService.checkIsBusinessNameUnique(name);
    return JSON.stringify({ isLegalNameUnique: isLegalNameUnique });
  }

  @Put(':id')
  updateBusiness(@Param('id') id: number, @Body() updatedBusinessDto: CreateBusinessDto) {
    return this.businessesService.updateBusiness(id, updatedBusinessDto);
  }

  @Delete(':id')
  deleteBusiness(@Param('id') id: number) {
    return this.businessesService.deleteBusiness(id);
  }
}
