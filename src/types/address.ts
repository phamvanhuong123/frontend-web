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
