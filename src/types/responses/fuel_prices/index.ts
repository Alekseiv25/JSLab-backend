import { FuelPrice } from 'src/fuel_prices/fuel_prices.model';

export interface IGetAllFuelPricesResponse {
  status: number;
  data: FuelPrice[];
  totalCount?: number;
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

export interface IDeleteFuelPricesResponse {
  status: number;
  message: string;
  data: FuelPrice[];
}
