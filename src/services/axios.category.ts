import Category, { ParentCategory } from "~/types/category";
import axios from "./axios.customize";

const url = "api/v1/ecommerce/categorys";

export const categoryApi = {
    // get by id
    getById(id: string) {
        return axios.get<Category>(`${url}/${id}`).then(res => res.data);
    },
    // Lấy tất cả danh mục
    getAll() {
        return axios.get<Category[]>(url).then(res => res.data);
    },

    // Lấy danh sách tên danh mục cha

    getAllCategoryParentNames(): Promise<ParentCategory[]> {
        return axios.get<Category[]>(url)
          .then(res => {
            return res.data
              .filter(item => item.parentCategoryId === null)
              .map(item => ({
                id: item.id,
                name: item.name
              }));
          })
          .catch(error => {
            console.error("Error fetching parent categories:", error);
            throw new Error("Failed to fetch parent categories");
          });
    },
      

    // Tạo danh mục
    createCategory(category: any) {
        return axios.post<Category>(url, category).then(res => res.data);
    },

    // Cập nhật danh mục
    updateCategory(id: string, category: any) {
        return axios.put<Category>(`${url}/${id}`, category).then(res => res.data);
    },
}
