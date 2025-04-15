import Category from "~/types/category";
import axios from "./axios.customize";

export const categoryApi = {
    // Danh sách người dùng
    getAll(){
        const url = "api/v1/ecommerce/categorys"
        return axios.get<Category[]>(url).then(res => res.data);
    }
}
