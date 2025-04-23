// interface VnPaymentRequestModel {
//   OrderCode: string;
//   FullName: string;
//   Description: string;
//   Amount: number;
//   CreatedDate: string;
// }

interface VnPayResponse {
  success: boolean;
  paymentMethod: string;
  orderDescription: string;
  orderCode: string;
  paymentId: string;
  transactionId: string;
  vnPayResponseCode: string;
}

export default VnPayResponse;
