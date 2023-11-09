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

export interface OperationTableColumns {
  sunday: boolean;
  sundayFrom: string;
  sundayTo: string;
  sundayBreakClosed: boolean;
  sundayBreakFrom: string;
  sundayBreakTo: string;
  monday: boolean;
  mondayFrom: string;
  mondayTo: string;
  mondayBreakClosed: boolean;
  mondayBreakFrom: string;
  mondayBreakTo: string;
  tuesday: boolean;
  tuesdayFrom: string;
  tuesdayTo: string;
  tuesdayBreakClosed: boolean;
  tuesdayBreakFrom: string;
  tuesdayBreakTo: string;
  wednesday: boolean;
  wednesdayFrom: string;
  wednesdayTo: string;
  wednesdayBreakClosed: boolean;
  wednesdayBreakFrom: string;
  wednesdayBreakTo: string;
  thursday: boolean;
  thursdayTo: string;
  thursdayFrom: string;
  thursdayBreakClosed: boolean;
  thursdayBreakFrom: string;
  thursdayBreakTo: string;
  friday: boolean;
  fridayFrom: string;
  fridayTo: string;
  fridayBreakClosed: boolean;
  fridayBreakFrom: string;
  fridayBreakTo: string;
  saturday: boolean;
  saturdayFrom: string;
  saturdayTo: string;
  saturdayBreakClosed: boolean;
  saturdayBreakFrom: string;
  saturdayBreakTo: string;
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
