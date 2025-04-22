import axios from "./axios.customize";
import Product, { CreateAProduct, DetailAProduct, ProductQueryParameters } from '~/types/product';

const BASE_URL = "/api/v1/ecommerce";
const BASE_URLv2 = "/api/v2/ecommerce";
export const productApi = {
    // Lấy danh sách tất cả sản phẩm
    getAll() {
        return axios.get<Product[]>(`${BASE_URL}/products`).then(res => res.data);
    },

    CreateProduct(formData: FormData){
        return axios.post(`${BASE_URL}/products`, formData)
    },
    callFetchProductById(id: string) {
        return axios.get(`${BASE_URL}/products/${id}`);
    },
    getAllPage: async (params: ProductQueryParameters) => {
        const response = await axios.get(`${BASE_URL}/products/page`, { params });
        return response.data;
    },
    //lây hình ảnh bằng slug
    callFetchProductBySlug: async (slug: string) => {
        return await axios.get(`${BASE_URLv2}/products`, {
          params: { slug },
        });
    },
    //xoa sản phẩm
    deleteProduct: async (id: string) => {
        return await axios.delete(`${BASE_URL}/products/${id}`);
    },
    //lấy theo id
    getById: async (id: string) => {
        return await axios.get<Product>(`${BASE_URL}/products/${id}`).then(res => res.data);
    },
    getByIdHaveId: async (id: string) => {
        return await axios.get<DetailAProduct>(`${BASE_URL}/products/${id}`).then(res => res.data);;
    },
    //cập nhật sản phẩm
    updateProduct: async (id: string, formData: FormData) => {
        return await axios.put<Product>(`${BASE_URL}/products/${id}`, formData);
    },
};


// Lấy danh sách danh mục sản phẩm
export const callFetchCategory = () => {
return axios.get(`${BASE_URL}/categorys`);
};

// Lấy danh sách sản phẩm với query
export const callFetchListProduct = (query: string) => {
return axios.get(`${BASE_URL}/products?${query}`);
};
