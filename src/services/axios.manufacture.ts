import axios from "./axios.customize";
import { CreateAManufacture } from "~/types/manufacture";
import Manufacturer from "~/types/manufacture";

const url = "api/v1/ecommerce/manufacturers"

export const manufactureApi = {
    getAll() {

        return axios.get<Manufacturer[]>(url).then(res => res.data);
    },
    getById(id: string) {

        return axios.get<Manufacturer>(`${url}/${id}`).then(res => res.data);
    },
    create(data: CreateAManufacture) {

        return axios.post<Manufacturer>(url, data).then(res => res.data);
    },
    update(id: string, manufacturer: Manufacturer) {

        return axios.put<Manufacturer>(`${url}/${id}`, manufacturer).then(res => res.data);
    },
    delete(id: string) {

        return axios.delete(`${url}/${id}`).then(res => res.data);
    }
}
