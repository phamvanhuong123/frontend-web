import axios from "./axios.customize"; // Import the customized Axios instance
import { StoreLocation } from "../types/store"; // Import the Store interface

const url = "api/v1/ecommerce/store-location"; // Base URL for store-related endpoints

const storeApi = {
  // Fetch all stores
  getAllStores: async (): Promise<StoreLocation[]> => {
    const response = await axios.get(`${url}`).then((res) => res.data);
    return response;
  },

  // Fetch a single store by ID
  getStoreById: async (id: string): Promise<StoreLocation> => {
    const response = await axios.get(`${url}/${id}`);
    return response.data;
  },
  getIdOfStore: async (): Promise<StoreLocation> => {
    const response = await axios.get(`${url}`).then((res) => res.data);
    const storeId = response[0];
    return storeId;
  },
};

export default storeApi;