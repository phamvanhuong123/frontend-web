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
  vnPayTransactionStatus?: string;
}

export interface CreatePaymentCod {
  orderCode: string;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionId: string;
  paidAt: Date;
}

export default VnPayResponse;
