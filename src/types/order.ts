import OrderItem from "./orderItem";

interface Order {
  orderCode: string;
  id: string;
  userId: string;
  shippingAddressId: string;
  billingAddressId: string | null;
  couponId: string | null;
  paymentId: string | null;
  notes: string;
  totalAmount: number;
  orderItems: OrderItem[];
}
export default Order;