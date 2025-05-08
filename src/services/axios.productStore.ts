import axios from "./axios.customize";
import ProductStore from "../types/productStore"; 

const url = "api/v1/ecommerce/product-store-inventory"; 

export const productStoreApi = {
     getById :async(idProduct: string, idStore : string) =>{
         return axios.get<ProductStore>(`${url}/product/${idProduct}/store/${idStore}`).then((res) => res.data);
     },
};

export default productStoreApi; 
