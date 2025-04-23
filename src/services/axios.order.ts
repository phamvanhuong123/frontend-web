import Order from "~/types/order";
import axios from "./axios.customize";

const URL = "api/v1/ecommerce/order";

export const orderApi = {
  // Danh sách order
  getAll() {
    return axios.get<Order[]>(URL).then((res) => res.data);
  },
  // Thêm order
  createOrder(order: any) {
    return axios.post(URL, order);
  },
  // Cập nhật order
  updateOrder(id: string, order: any) {
    const url = `${URL}/${id}`;
    return axios.put(url, order);
  },
  // Detele order
  deleteOrder(id: string) {
    const url = `${URL}/${id}`;
    return axios.delete(url);
  },
  // Lấy order theo id
  getOrderById(id: string) {
    const url = `${URL}/${id}`;
    return axios.get<Order>(url).then((res) => res.data);
  },
  // Cập nhật trạng thái order
  updateOrderStatus(id: string, status: string) {
    const url = `${URL}/${id}/status`;
    return axios.put(url, { status });
  },
  callOrderHistory(userId: string) {
    return axios.get(`${URL}/${userId}/history`);
  },
  // callPlaceOrder(data: Record<string, any>) {
  //   return axios.post(URL, {
  //     ...data,
  //   });
  // },
};
