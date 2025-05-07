import axios from "./axios.customize";

const url = "api/v1/ecommerce";

export const couponApi = {
  // Lấy danh sách tất cả voucher
  getAllCoupons: (onlyActive: boolean = true, userId?: string) => {
    const fullUrl = `${url}/coupons`;
    return axios.get(fullUrl, {
      params: { onlyActive, userId },
    });
  },
  getActiveCoupons: (onlyActive: boolean = true, userId?: string) => {
    const fullUrl = `${url}/coupons-active`;
    return axios.get(fullUrl, {
      params: { onlyActive, userId },
    });
  },

  // Lấy danh sách voucher đã lưu
  getSavedCoupons: (userId: string) => {
    const fullUrl = `${url}/coupons/saved`;
    return axios.get(fullUrl, {
      params: { userId },
    });
  },

  // Lưu voucher
  saveCoupon: (userId: string, couponCode: string) => {
    const fullUrl = `${url}/coupons/save`;
    return axios.post(fullUrl, {
      userId,
      couponCode,
    });
  },

  // Áp dụng voucher
  applyCoupon: (code: string, orderTotal: number, userId?: string) => {
    const fullUrl = `${url}/coupons/apply`;
    return axios.post(fullUrl, {
      code,
      userId,
      orderTotal,
    });
  },
  // get coupon by id
  getById: (id: string) => {
    const fullUrl = `${url}/coupons/${id}`;
    return axios.get(fullUrl);
  },
  // create coupon
  create: (data: any) => {
    const fullUrl = `${url}/coupons`;
    return axios.post(fullUrl, data);
  },
  // update coupon
  update: (id: string, data: any) => {
    const fullUrl = `${url}/coupons/${id}`;
    return axios.put(fullUrl, data);
  },
  // delete coupon
  delete: (id: string) => {
    const fullUrl = `${url}/coupons/${id}`;
    return axios.delete(fullUrl);
  },
  useAndDelete: (id: string) => {
    const fullUrl = `${url}/coupons/use-and-delete/${id}`;
    return axios.delete(fullUrl);
  },
};

export default couponApi;
