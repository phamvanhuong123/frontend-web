import Order from "~/types/order";
import axios from "./axios.customize";

export const orderApi = {
    // Danh sách người dùng
    getAll(){
        const url = "api/v1/ecommerce/order"
        return axios.get<Order[]>(url).then(res => res.data);
    }
}
