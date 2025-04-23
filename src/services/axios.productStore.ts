import axios from "./axios.customize"; // Import the customized Axios instance
import ProductStore from "../types/productStore"; // Import the Store interface

const url = "api/v1/ecommerce/product-store-inventory"; // Base URL for store-related endpoints

export const productStoreApi = {
    //get product store by id
     getById :async(idProduct: string, idStore : string) =>{
         return axios.get<ProductStore>(`${url}/product/${idProduct}/store/${idStore}`).then((res) => res.data);
     },
};

export default productStoreApi; // Export the productStoreApi object for use in other parts of the application
