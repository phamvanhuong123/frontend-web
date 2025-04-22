interface Address {
  id?: string;
  userId: string;
  receiverName: string;
  receiverPhone: string;
  streetAddress: string;
  ward?: string;
  district?: string;
  city: string;
  country: string;
  postalCode?: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}
export default Address;

export interface Province {
  code: string;
  name: string;
}

export interface District {
  code: string;
  name: string;
  province_code: string;
}

export interface Ward {
  code: string;
  name: string;
  district_code: string;
}
