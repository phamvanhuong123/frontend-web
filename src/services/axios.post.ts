import axios from "./axios.customize";
import { Post, CreatePost } from "~/types/post";
const url = "api/v1/ecommerce/posts";
export const postApi = {
    getAll() {
        
        return axios.get<Post[]>(url).then(res => res.data);
    },
    getById(id: string) {
        return axios.get<Post>(`${url}/${id}`).then(res => res.data);
    },
    create(data: CreatePost) {
        return axios.post<Post>(url, data).then(res => res.data);
    },
    update(id: string, data: Partial<Post>) {
        return axios.put<Post>(`${url}/${id}`, data).then(res => res.data);
    },
    delete(id: string) {
        return axios.delete(`${url}/${id}`).then(res => res.data);
    }
} 