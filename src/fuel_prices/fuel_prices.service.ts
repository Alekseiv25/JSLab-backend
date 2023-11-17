import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FuelPrice } from './fuel_prices.model';
import {
  IBasicFuelPriceResponse,
  IDeleteFuelPriceResponse,
  IDeleteFuelPricesResponse,
  IGetAllFuelPricesResponse,
} from 'src/types/responses/fuel_prices';
import { makeDeleteMessage, makeNotFoundMessage } from 'src/utils/generators/messageGenerators';
import { CreateFuelPriceDto } from './dto/fuel-price.dto';
import { Op } from 'sequelize';

@Injectable()
export class FuelPricesService {
  constructor(@InjectModel(FuelPrice) private fuelPriceRepository: typeof FuelPrice) {}

  async getAllFuelPrices(): Promise<IGetAllFuelPricesResponse> {
    const fuelPrices: FuelPrice[] | [] = await this.fuelPriceRepository.findAll();

    if (fuelPrices.length === 0) {
      throw new HttpException(makeNotFoundMessage('Fuel Prices'), HttpStatus.NOT_FOUND);
    }
    const response: IGetAllFuelPricesResponse = { status: HttpStatus.OK, data: fuelPrices };
    return response;
  }

  async GetFuelPriceById(id: number): Promise<IBasicFuelPriceResponse> {
    const fuelPrice: FuelPrice | null = await this.fuelPriceRepository.findByPk(id);

    if (!fuelPrice) {
      throw new HttpException(makeNotFoundMessage('Fuel Price'), HttpStatus.NOT_FOUND);
    }

    const response: IBasicFuelPriceResponse = { status: HttpStatus.OK, data: fuelPrice };
    return response;
  }

  async getFuelPricesByStationId(stationId: number): Promise<IGetAllFuelPricesResponse> {
    const fuelPrices: FuelPrice[] | null = await this.fuelPriceRepository.findAll({
      where: {
        stationId: {
          [Op.in]: [stationId],
        },
      },
    });
    if (fuelPrices.length === 0) {
      throw new HttpException(makeNotFoundMessage('Fuel Price'), HttpStatus.NOT_FOUND);
    }

    const response: IGetAllFuelPricesResponse = { status: HttpStatus.OK, data: fuelPrices };
    return response;
  }

  async createNewFuelPrice(dto: CreateFuelPriceDto): Promise<IBasicFuelPriceResponse> {
    const newFuelPrice: FuelPrice = await this.fuelPriceRepository.create(dto);
    const response: IBasicFuelPriceResponse = { status: HttpStatus.OK, data: newFuelPrice };
    return response;
  }

  async updateFuelPrice(
    id: number,
    updatedStationDto: CreateFuelPriceDto,
  ): Promise<IBasicFuelPriceResponse> {
    const fuelPrice: FuelPrice | null = await this.fuelPriceRepository.findOne({ where: { id } });
    if (!fuelPrice) {
      throw new HttpException(makeNotFoundMessage('Fuel Price'), HttpStatus.NOT_FOUND);
    }
    const updatedFuelPrice: FuelPrice = await fuelPrice.update(updatedStationDto);

    const response: IBasicFuelPriceResponse = { status: HttpStatus.OK, data: updatedFuelPrice };
    return response;
  }

  async deleteFuelPrice(id: number): Promise<IDeleteFuelPriceResponse> {
    const fuelPrice: FuelPrice | null = await this.fuelPriceRepository.findByPk(id);

    if (!fuelPrice) {
      throw new HttpException(makeNotFoundMessage('Fuel Price'), HttpStatus.NOT_FOUND);
    }
    await fuelPrice.destroy();
    const response: IDeleteFuelPriceResponse = {
      status: HttpStatus.OK,
      message: makeDeleteMessage('Fuel Price'),
      data: fuelPrice,
    };
    return response;
  }

  async deleteFuelPrices(ids: number[]): Promise<IDeleteFuelPricesResponse> {
    const fuelPrices: FuelPrice[] = await this.fuelPriceRepository.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    if (fuelPrices.length === 0) {
      throw new HttpException(makeNotFoundMessage('Fuel Prices'), HttpStatus.NOT_FOUND);
    }

    await this.fuelPriceRepository.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    const response: IDeleteFuelPricesResponse = {
      status: HttpStatus.OK,
      message: makeDeleteMessage('Fuel Prices'),
      data: fuelPrices,
    };

    return response;
  }
}
