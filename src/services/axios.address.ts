import axios from "./axios.customize";
import Address from "~/types/address";
const url = "api/v1/ecommerce/address";

export const addressApi = {
  getAll() {
    return axios.get<Address[]>(url).then((res) => res.data);
  },
  getById(id: string) {
    return axios.get<Address>(`${url}/${id}`).then((res) => res.data);
  },
  getByUserId(userId: string) {
    return axios.get<Address[]>(url).then((res) => {
      return res.data.filter((address) => address.userId === userId);
    });
  },
  create(data: Address) {
    return axios.post<Address>(url, data).then((res) => res.data);
  },
  update(id: string, data: Partial<Address>) {
    return axios.put<Address>(`${url}/${id}`, data).then((res) => res.data);
  },
  delete(id: string) {
    return axios.delete(`${url}/${id}`).then((res) => res.data);
  },
};
