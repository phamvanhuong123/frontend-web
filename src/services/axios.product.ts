import axios from "./axios.customize";
import Product from '~/types/product';

const BASE_URL = "/api/v1/ecommerce";

export const productApi = {
    // Lấy danh sách tất cả sản phẩm
    getAll() {
        return axios.get<Product[]>(`${BASE_URL}/products`).then(res => res.data);
    },

    // Tạo sản phẩm mới
    createProduct(product: Product) {
        return axios.post(`${BASE_URL}/products`, product);
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

// Lấy thông tin chi tiết sản phẩm theo ID
export const callFetchProductById = (id: string) => {
    return axios.get(`${BASE_URL}/products/${id}`);
};
