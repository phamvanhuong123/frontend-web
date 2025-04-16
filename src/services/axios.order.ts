import Order from "~/types/order";
import axios from "./axios.customize";

export const orderApi = {
    // Danh sách người dùng
    getAll(){
        const url = "api/v1/ecommerce/order"
        return axios.get<Order[]>(url).then(res => res.data);
    }
}

export const callPlaceOrder = (data: Record<string, any>) => {
    return axios.post('/api/v1/order', {
        ...data
    })
}

export const callOrderHistory = () => {
    return axios.get('/api/v1/history');
}