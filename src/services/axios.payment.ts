// import  from "~/types/order";
import axios from "./axios.customize";

const URL = "api/v1/ecommerce/payment";

export const paymentApi = {
  // Thêm order
  createOrder(order: any) {
    return axios.post(URL, order);
  },
  // Tạo đơn hàng VNPay
  createVnPayPayment(order: any) {
    return axios.post(`${URL}/vnpay`, order).then((res) => res.data);
  },
  // Tạo đơn hàng Momo
  createMomoPayment(order: any) {
    return axios.post(`${URL}/momo`, order).then((res) => res.data);
  },
};
