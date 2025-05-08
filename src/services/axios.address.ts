import axios from "./axios.customize";
import Address, { District, Province, Ward } from "~/types/address";
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
  //api tinh
  getProvinces(): Promise<Province[]> {
    return axios.get(url + "/provinces").then((res) => res.data);
  },

  // api huyen
  getDistrictsByProvince(provinceCode: string): Promise<District[]> {
    return axios
      .get(url + "/provinces/" + provinceCode)
      .then((res) => res.data.districts || []);
  },

  // api xa
  getWardsByDistrict(districtCode: string): Promise<Ward[]> {
    return axios
      .get(`${url}/districts/${districtCode}`)
      .then((res) => res.data.wards || []);
  },

  // api tim kiem dia chi
  searchAddress(query: {
    province?: string;
    district?: string;
    ward?: string;
  }): Promise<Address[]> {
    return axios
      .get(`${url}/search`, { params: query })
      .then((res) => res.data);
  },

  setDefaultAddress(id: string): Promise<Address> {
    return axios
      .put<Address>(`${url}/${id}/set-default`)
      .then((res) => res.data);
  },
};
