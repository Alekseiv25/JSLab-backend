export interface UserTableColumns {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  isSuspended?: boolean;
  suspensionReason?: string;
  isFinishedTutorial: boolean;
  businessId?: number;
}

export interface BusinessTableColumns {
  legalName: string;
  yearsOfOperation: string;
  type: string;
  streetAddress: string;
  secondaryAddress: string;
  city: string;
  ST: string;
  zip: number;
}

export interface FuelPricesColumns {
  fuelType: string;
  grade: string;
  displayName: string;
  rate: string;
  price: number;
  minDiscount: number;
  maxDiscount: number;
}

export interface StationTableColumns {
  businessId: number;
  type: string;
  brand: string;
  name: string;
  address: string;
  lat: string;
  lng: string;
  phone: string;
  email: string;
  convenientStore: boolean;
  groceries: boolean;
  alcohol: boolean;
  automotive: boolean;
  ice: boolean;
  tobacco: boolean;
  lottery: boolean;
  carWash: boolean;
  restrooms: boolean;
  ATM: boolean;
  foodOfferings: boolean;
  restaurant: boolean;
  overnightParking: boolean;
  showers: boolean;
  POS: string;
}

export interface OperationTableColumns {
  day: string;
  isOpen: boolean;
  timeFrom: string;
  timeTo: string;
  isBreak: boolean;
  timeBreakFrom: string;
  timeBreakTo: string;
}

export interface AccountTableColumns {
  stationId: number;
  businessId: number;
  paymentMethod: string;
  verificationMethod: string;
  accountNickname: string;
  accountType: string;
  routingNumber: string;
  accountNumber: string;
}

export interface TokenTableColumns {
  userId: number;
  refreshToken: string;
}
