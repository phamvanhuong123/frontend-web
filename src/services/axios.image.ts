import axios from "./axios.customize";
import { Image } from "~/types/image"; // Giả sử bạn đã định nghĩa interface Image

const url = "api/v1/ecommerce/image";

export const imageApi = {
  getAll() {
    return axios.get<Image[]>(url).then((res) => res.data);
  },

  getById(id: string) {
    return axios.get<Image>(`${url}/${id}`).then((res) => res.data);
  },

  getByProductId(productId: string) {
    return axios
      .get<Image[]>(`${url}/product/${productId}`)
      .then((res) => res.data);
  },

  upload(file: File, productId?: string) {
    const formData = new FormData();
    formData.append("file", file);
    if (productId) {
      formData.append("productId", productId);
    }
    return axios
      .post<{ Url: string }>(`${url}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  },

  update(id: string, image: Partial<Image>) {
    return axios.put<Image>(`${url}/${id}`, image).then((res) => res.data);
  },

  delete(id: string) {
    return axios.delete<boolean>(`${url}/${id}`).then((res) => res.data);
  },
};
