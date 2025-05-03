interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  minimumSpend: number;
  startTime?: string;
  endTime?: string;
  usageLimit?: number;
  usageLimitPerUser?: number;
  isActive: boolean;
  userId?: string;
}

export default Coupon;
