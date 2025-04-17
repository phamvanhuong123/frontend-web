import axios from "./axios.customize";
import { CreateAManufacture } from "~/types/manufacture";
import Manufacturer from "~/types/manufacture";

export const manufactureApi = {
    getAll() {
        const url = "api/v1/ecommerce/manufacturers"
        return axios.get<Manufacturer[]>(url).then(res => res.data);
    },
    getById(id: string) {
        const url = `api/v1/ecommerce/manufacturers/${id}`
        return axios.get<Manufacturer>(url).then(res => res.data);
    },
    create(data: CreateAManufacture) {
        const url = "api/v1/ecommerce/manufacturers"
        return axios.post<Manufacturer>(url, data).then(res => res.data);
    },
    update(id: string, data: Partial<Manufacturer>) {
        const url = `api/v1/ecommerce/manufacturers/${id}`
        return axios.put<Manufacturer>(url, data).then(res => res.data);
    },
    delete(id: string) {
        const url = `api/v1/ecommerce/manufacturers/${id}`
        return axios.delete(url).then(res => res.data);
    }
}
