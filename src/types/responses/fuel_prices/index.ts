import { FuelPrice } from 'src/fuel_prices/fuel_prices.model';

export interface IGetAllFuelPricesResponse {
  status: number;
  data: FuelPrice[];
}

export interface IBasicFuelPriceResponse {
  status: number;
  data: FuelPrice;
}

export interface IDeleteFuelPriceResponse {
  status: number;
  message: string;
  data: FuelPrice;
}
