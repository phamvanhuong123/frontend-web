interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT" | number; // Sử dụng chuỗi hoặc số
  value: number;
  minimumSpend: number;
  startTime?: string;
  endTime?: string;
  usageLimit?: number;
  usageLimitPerUser?: number;
  isActive: boolean;
  userId?: string | null;
}

export default Coupon;
