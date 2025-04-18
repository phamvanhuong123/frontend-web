import axios from "./axios.customize";
import User from '~/types/user';

const BASE_URL = "api/v1/ecommerce";

export const userApi = {
    // Lấy người dùng theo ID
    async getById(id: string): Promise<User> {
        try {
            const response = (await axios.get<User>(`${BASE_URL}/users/${id}`));
            return response;
        } catch (error) {
            console.error("Error fetching user by ID:", error);
            throw error;
        }
    },

    // Danh sách người dùng
    async getAll(): Promise<User[]> {
        try {
            const response = await axios.get<User[]>(`${BASE_URL}/users`);
            return response;
        } catch (error) {
            console.error("Error fetching all users:", error);
            throw error;
        }
    },

    // Tạo người dùng
    async createUser(user: Partial<User>): Promise<User> {
        try {
            const response = await axios.post<User>(`${BASE_URL}/users`, user);
            return response;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    // Cập nhật người dùng
    async updateUser(id: string, user: Partial<User>): Promise<User> {
        try {
            const response = await axios.put<User>(`${BASE_URL}/users/${id}`, user);
            return response;
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    },

    // Xóa người dùng
    async deleteUser(id: string): Promise<void> {
        try {
            await axios.delete(`${BASE_URL}/users/${id}`);
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    },

    // Tìm kiếm người dùng theo tên
    async searchUserByName(name: string): Promise<User[]> {
        try {
            const response = await axios.get<User[]>(`${BASE_URL}/users/search?name=${name}`);
            return response;
        } catch (error) {
            console.error("Error searching user by name:", error);
            throw error;
        }
    },

    // Xem chi tiết người dùng
    async getUserDetails(id: string): Promise<User> {
        try {
            const response = await axios.get<User>(`${BASE_URL}/users/${id}`);
            return response;
        } catch (error) {
            console.error("Error fetching user details:", error);
            throw error;
        }
    },
};

// Đăng xuất
export const callLogout = async (): Promise<void> => {
    try {
        await axios.post(`${BASE_URL}/auth/logout`);
    } catch (error) {
        console.error("Error logging out:", error);
        throw error;
    }
};

// Cập nhật avatar
export const callUpdateAvatar = async (fileImg: File): Promise<void> => {
    try {
        const bodyFormData = new FormData();
        bodyFormData.append('fileImg', fileImg);

        await axios.post(`${BASE_URL}/file/upload`, bodyFormData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "upload-type": "avatar",
            },
        });
    } catch (error) {
        console.error("Error updating avatar:", error);
        throw error;
    }
};

// Cập nhật thông tin người dùng
export const callUpdateUserInfo = async (_id: string, phone: string, fullName: string, avatar: string): Promise<void> => {
    try {
        await axios.put(`${BASE_URL}/users`, { _id, phone, fullName, avatar });
    } catch (error) {
        console.error("Error updating user info:", error);
        throw error;
    }
};

// Cập nhật mật khẩu
export const callUpdatePassword = async (email: string, oldpass: string, newpass: string): Promise<void> => {
    try {
        await axios.post(`${BASE_URL}/users/change-password`, { email, oldpass, newpass });
    } catch (error) {
        console.error("Error updating password:", error);
        throw error;
    }
};

// Lấy thông tin tài khoản người dùng
export const callFetchAccount = async (): Promise<User> => {
    try {
        const response = await axios.get<User>(`${BASE_URL}/users`);
        return response;
    } catch (error) {
        console.error("Error fetching account info:", error);
        throw error;
    }
};

// Đăng ký tài khoản
export const callRegister = async (fullName: string, email: string, password: string, phone: string): Promise<void> => {
    try {
        await axios.post(`${BASE_URL}/users/register`, { fullName, email, password, phone });
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

// Đăng nhập
export const callLogin = async (username: string, password: string): Promise<void> => {
    try {
        await axios.post(`${BASE_URL}/auth/login`, { username, password });
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};