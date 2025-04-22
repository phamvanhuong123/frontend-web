import Order from "~/types/order";
import axios from "./axios.customize";

export const orderApi = {
  // Danh sách order
  getAll() {
    const url = "api/v1/ecommerce/order";
    return axios.get<Order[]>(url).then((res) => res.data);
  },
  // Thêm order
  createOrder(order: any) {
    const url = "api/v1/ecommerce/order";
    return axios.post(url, order);
  },
  // Cập nhật order
  updateOrder(id: string, order: any) {
    const url = `api/v1/ecommerce/order/${id}`;
    return axios.put(url, order);
  },
  // Detele order
  deleteOrder(id: string) {
    const url = `api/v1/ecommerce/order/${id}`;
    return axios.delete(url);
  },
  // Lấy order theo id
  getOrderById(id: string) {
    const url = `api/v1/ecommerce/order/${id}`;
    return axios.get<Order>(url).then((res) => res.data);
  },
  // Cập nhật trạng thái order
  updateOrderStatus(id: string, status: string) {
    const url = `api/v1/ecommerce/order/${id}/status`;
    return axios.put(url, { status });
  },
  callPlaceOrder(data: Record<string, any>) {
    return axios.post("/api/v1/order", {
      ...data,
    });
  },
};

export const callOrderHistory = () => {
  return axios.get("/api/v1/history");
};
