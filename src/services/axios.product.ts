import axios from "./axios.customize";
import Product from '~/types/product'
export const productApi = {
    // Danh sách người dùng
    getAll(){
        const url = "api/v1/ecommerce/products"
        return axios.get<Product[]>(url).then(res => res.data);
    }
}
