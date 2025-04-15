import axios from "./axios.customize";
import User from '~/types/user'
export const userApi = {
    // Danh sách người dùng
    getAll(){
        const url = "api/v1/ecommerce/users"
        return axios.get<User[]>(url);
    }
}
