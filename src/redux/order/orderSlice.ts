import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

/**
 * carts = [
 *   { quantity: 1, id: 'abc', detail: { id: 'abc', name: 'def', quantity: 10 } },
 *   { quantity: 1, id: '123', detail: { id: '123', name: '456', quantity: 5 } },
 * ]
 */
export interface CartItem {
  quantity: number;
  id: string;
  detail: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: [];
  };
}

export interface Coupon {
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

const initialState: {
  carts: CartItem[];
  selectedProducts?: CartItem[];
  selectedCoupon?: Coupon;
} = {
  carts: [],
  selectedProducts: [],
  selectedCoupon: undefined,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // Thêm sản phẩm vào giỏ hàng
    doAddProductAction: (state, action) => {
      const carts = state.carts; // Lấy giỏ hàng hiện tại từ state
      const item = action.payload; // Lấy payload từ action (thông tin sản phẩm)

      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const isExistIndex = carts.findIndex((c) => c.id === item.id);

      // Nếu sản phẩm đã tồn tại trong giỏ hàng
      if (isExistIndex > -1) {
        // Tăng số lượng sản phẩm
        carts[isExistIndex].quantity += item.quantity;

        // Kiểm tra nếu số lượng vượt quá số lượng tồn kho
        if (
          carts[isExistIndex].detail.quantity < carts[isExistIndex].quantity
        ) {
          // Đặt lại số lượng = số lượng tồn kho tối đa
          carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity;
        }
      }
      // Nếu sản phẩm chưa có trong giỏ hàng
      else {
        // Thêm sản phẩm mới vào giỏ hàng
        carts.push({
          quantity: item.quantity,
          id: item.id,
          detail: item.detail,
        });
      }

      // Cập nhật lại state giỏ hàng
      state.carts = carts;
      message.success("Sản phẩm đã được thêm vào Giỏ hàng");
    },

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    doUpdateCartAction: (state, action) => {
      const carts = state.carts;
      const item = action.payload;

      const isExistIndex = carts.findIndex((c) => c.id === item.id);
      if (isExistIndex > -1) {
        carts[isExistIndex].quantity = item.quantity;
        if (
          carts[isExistIndex].quantity > carts[isExistIndex].detail.quantity
        ) {
          carts[isExistIndex].quantity = carts[isExistIndex].detail.quantity;
        }
      }

      // Cập nhật giỏ hàng
      state.carts = carts;
    },
    doSelectVoucherAction: (state, action) => {
      const { id, code, description, discountType, value, minimumSpend } =
        action.payload;
      const selectedCoupon: Coupon = {
        id,
        code,
        description,
        discountType,
        value,
        minimumSpend,
        isActive: true,
      };
      state.selectedCoupon = selectedCoupon;
      message.success("Voucher đã được chọn thành công");
    },
    doDeleteVoucherSelectedAction: (state) => {
      state.selectedCoupon = undefined;
      message.success("Voucher đã được xóa khỏi Giỏ hàng");
    },

    // Xóa sản phẩm khỏi giỏ hàng
    doDeleteItemCartAction: (state, action) => {
      state.carts = state.carts.filter((c) => c.id !== action.payload.id);
      message.success("Sản phẩm đã được xóa khỏi Giỏ hàng");
    },

    // Đặt hàng và xóa giỏ hàng
    doPlaceOrderAction: (state, action) => {
      const { detailOrder, totalPrice } = action.payload;

      // Xóa giỏ hàng
      state.carts = [];

      // Bạn có thể lưu thông tin đơn hàng vào Redux nếu cần
      console.log("Chi tiết đơn hàng:", detailOrder);
      console.log("Tổng tiền:", totalPrice);

      message.success("Đặt hàng thành công!");
    },
    doSetSelectedProductsAction: (state, action) => {
      // action.payload là danh sách sản phẩm được chọn từ cart
      state.selectedProducts = action.payload.products;
    },
  },
  extraReducers: () => {
    // Có thể thêm các reducer bổ sung nếu cần
  },
});

export const {
  doAddProductAction,
  doUpdateCartAction,
  doDeleteItemCartAction,
  doPlaceOrderAction,
  doSetSelectedProductsAction,
  doSelectVoucherAction,
  doDeleteVoucherSelectedAction,
} = orderSlice.actions;

export default orderSlice.reducer;
