// interfaces for user account data
export interface userBusinessData {
  businessLegalName: string;
  yearsOfOperation: string;
  businessType: string;
}

export interface userLocationData {
  streetAdress: string;
  secondaryAdress: string | null;
  city: string;
  ST: string;
  zip: number;
}

export interface userData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userBusiness: userBusinessData;
  userLocation: userLocationData;
  userStations?: [];
  isAdmin: boolean;
  isSuspended: boolean;
  suspensionReason: string | null;
}
