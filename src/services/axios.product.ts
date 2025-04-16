import axios from "./axios.customize";
import Product from '~/types/product'
const url = "api/v1/ecommerce/products"
export const productApi = {
    
    // Danh sách product

    getAll(){
        
        return axios.get<Product[]>(url).then(res => res.data);
    },
    CreateProduct(product: any){
        return axios.post(url, product)
    }
}
