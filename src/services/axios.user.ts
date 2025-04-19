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
    debugger;
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
  callLogin(email: string, password: string) {
    const fullUrl = `${url}/login`;
    console.log("Đường dẫn API đang gọi:", fullUrl); // In ra đường dẫn đầy đủ
    return axios.post(fullUrl, {
      // Sử dụng biến fullUrl đã tạo
      Email: email,
      Password: password,
    });
  },
  callRegister(data: {
    Email: string;
    Password: string;
    Name: string;
    Phone: string;
  }) {
    const fullUrl = `${url}/register`;
    return axios.post(fullUrl, data);
  },
};

// Đăng xuất
export const callLogout = () => {
  return axios.post(`${url}/logout`);
};

// Cập nhật avatar
export const callUpdateAvatar = (fileImg: File) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios({
    method: "post",
    url: `${url}/file/upload`,
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
      "upload-type": "avatar",
    },
  });
};

// Cập nhật thông tin người dùng
export const callUpdateUserInfo = (
  _id: string,
  phone: string,
  fullName: string,
  avatar: string
) => {
  return axios.put(`${url}`, {
    _id,
    phone,
    fullName,
    avatar,
  });
};

// Cập nhật mật khẩu
export const callUpdatePassword = (
  email: string,
  oldpass: string,
  newpass: string
) => {
  return axios.post(`${url}/users/change-password`, {
    email,
    oldpass,
    newpass,
  });
};

// Lấy thông tin tài khoản người dùng
export const callFetchAccount = () => {
  return axios.get(`${url}`);
};
