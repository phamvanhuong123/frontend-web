import axios from "./axios.customize";
import Product, {
  DetailAProduct,
  ProductQueryParameters,
  UpdateAProduct,
} from "~/types/product";

const BASE_URL = "/api/v1/ecommerce";
const BASE_URLv2 = "/api/v2/ecommerce";
export const productApi = {
  // Lấy danh sách tất cả sản phẩm
  getAll() {
    return axios.get<Product[]>(`${BASE_URL}/products`).then((res) => res.data);
  },

  CreateProduct(formData: FormData) {
    return axios.post(`${BASE_URL}/products`, formData);
  },
  //create product to cloud img
  CreateProductToCloud(formData: FormData) {
    return axios.post(`${BASE_URLv2}/products`, formData);
  },
  //update product to cloud img
  updateProductToCloud: async (id: string, formData: FormData) => {
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    return await axios.post<Product>(`${BASE_URLv2}/products/${id}`, formData);
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
    return await axios
      .get<Product>(`${BASE_URL}/products/${id}`)
      .then((res) => res.data);
  },
  getByIdHaveId: async (id: string) => {
    return await axios
      .get<DetailAProduct>(`${BASE_URL}/products/${id}`)
      .then((res) => res.data);
  },
  //cập nhật sản phẩm
  updateProduct: async (id: string, formData: FormData) => {
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    return await axios.post<Product>(`${BASE_URL}/products/${id}`, formData);
  },
  updateProductQuantity: async (id: string, quantity: number) => {
    return await axios.post<UpdateAProduct>(
      `${BASE_URL}/products/buy-quantity/${id}`,
      {
        quantity,
      }
    );
  },
  // Thêm phương thức để lấy sản phẩm gợi ý
  getRecommendedProducts: (topN = 5) => {
    return axios.get(`${BASE_URL}/recommended?topN=${topN}`);
  },
  // Thêm phương thức để theo dõi click vào sản phẩm
  trackProductClick: (productId: string) => {
    debugger
    return axios.post(`${BASE_URL}/track-click`, { productId });
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
