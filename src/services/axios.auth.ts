import axios from "./axios.customize";

const url = "api/v1/ecommerce/auth";

export const authApi = {

  callLogin(email: string, password: string) {
    const fullUrl = `${url}/login`;
    console.log("Đường dẫn API đang gọi:", fullUrl);
    return axios.post(fullUrl, {
      Email: email,
      Password: password,
    });
  },
  callLogout () {
    return axios.post(`${url}/logout`)
    .finally(() => {
      localStorage.removeItem('access_token');
    });
  },
}