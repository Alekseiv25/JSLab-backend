export interface UserTableColumns {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  isSuspended?: boolean;
  suspensionReason?: string;
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
