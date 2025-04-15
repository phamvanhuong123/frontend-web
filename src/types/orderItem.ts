interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    priceAtOrder: number;
    totalItemPrice: number;
  }

export default OrderItem;