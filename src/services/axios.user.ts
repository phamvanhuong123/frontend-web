import axios from "./axios.customize";
import User from "~/types/user";

const url = "api/v1/ecommerce/users";

export const userApi = {
  //lấy người dùng theo id
  getById(id: string) {
    return axios.get<User>(`${url}/${id}`).then((res) => res.data);
  },
  // Danh sách người dùng

  getAll() {
    return axios.get<User[]>(url).then((res) => res.data);
  },

  // Tạo người dùng
  createUser(user: any) {
    return axios.post<User>(url, user).then((res) => res.data);
  },
  // Cập nhật người dùng
  updateUser(id: string, user: any) {
    return axios.put<User>(`${url}/${id}`, user).then((res) => res.data);
  },
  // Xóa người dùng
  deleteUser(id: string) {
    return axios.delete(`${url}/${id}`).then((res) => res.data);
  },
  // Tìm kiếm người dùng theo tên
  searchUserByName(name: string) {
    return axios
      .get<User[]>(`${url}/search?name=${name}`)
      .then((res) => res.data);
  },
  // Xem chi tiết người dùng
  getUserDetails(id: string) {
    return axios.get<User>(`${url}/${id}`).then((res) => res.data);
  },
  // Đăng nhập

  callUpdateUserInfo(formData: FormData) {
    return axios.put(`${url}/update-info`, formData);
  },
  //lấy thông tin tài khoản người dùng
  callFetchAccount() {
    return axios.get(`${url}`);
  },
  callUpdateAvatar(fileImg: File) {
    return axios.put(`${url}/update-avatar`, {
      fileImg,
    });
  },
};
