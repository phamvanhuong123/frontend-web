import axios from "./axios.customize";
import User from '~/types/user';

const BASE_URL = "/api/v1/ecommerce";

export const userApi = {
    // Lấy danh sách người dùng
    getAll() {
        const url = `${BASE_URL}/users`;
        return axios.get<User[]>(url).then(res => res.data);
    },
};

// Đăng xuất
export const callLogout = () => {
    return axios.post(`${BASE_URL}/auth/logout`);
};

// Cập nhật avatar
export const callUpdateAvatar = (fileImg: File) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: `${BASE_URL}/file/upload`,
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "avatar",
        },
    });
};

// Cập nhật thông tin người dùng
export const callUpdateUserInfo = (_id: string, phone: string, fullName: string, avatar: string) => {
    return axios.put(`${BASE_URL}/users`, {
        _id,
        phone,
        fullName,
        avatar,
    });
};

// Cập nhật mật khẩu
export const callUpdatePassword = (email: string, oldpass: string, newpass: string) => {
    return axios.post(`${BASE_URL}/users/change-password`, {
        email,
        oldpass,
        newpass,
    });
};

// Lấy thông tin tài khoản người dùng
export const callFetchAccount = () => {
    return axios.get(`${BASE_URL}/users`);
};

// Đăng ký tài khoản
export const callRegister = (fullName: string, email: string, password: string, phone: string) => {
    return axios.post(`${BASE_URL}/users/register`, { fullName, email, password, phone });
};

// Đăng nhập
export const callLogin = (username: string, password: string) => {
    return axios.post(`${BASE_URL}/auth/login`, { username, password });
};