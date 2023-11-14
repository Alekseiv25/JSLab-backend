import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  IBasicBusinessResponse,
  ICheckBusinessNameResponse,
  IDeleteBusinessResponse,
  IGetAllBusinessResponse,
} from 'src/types/responses/businesses';
import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';

@Controller('businesses')
export class BusinessesController {
  constructor(private businessesService: BusinessesService) {}

  @Get()
  getAllBusinesses(): Promise<IGetAllBusinessResponse> {
    return this.businessesService.getAllBusinesses();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getBusinessByID(@Param('id') id: number): Promise<IBasicBusinessResponse> {
    return this.businessesService.getBusinessByID(id);
  }

  @Post()
  createNewBusiness(
    @Body() businessDto: CreateBusinessDto,
  ): Promise<IBasicBusinessResponse | ICheckBusinessNameResponse> {
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
  @UseGuards(AuthGuard)
  updateBusiness(
    @Param('id') id: number,
    @Body() updatedData: CreateBusinessDto,
  ): Promise<IBasicBusinessResponse> {
    return this.businessesService.updateBusiness(id, updatedData);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteBusiness(@Param('id') id: number): Promise<IDeleteBusinessResponse> {
    return this.businessesService.deleteBusiness(id);
  }
}
