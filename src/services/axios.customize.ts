import axios from "axios";

 const instance = axios.create({
    baseURL: "http://localhost:5000"
});


instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if(response && response.data)
        return response.data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });



export const getUsers = async () => {
    debugger
    try {
        const response = await instance.get("/api/v1/ecommerce/users");
        console.log("API Response Data:", response); 
        return response;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const getProducts = async () => {
    try {
        const response = await instance.get("/api/v1/ecommerce/products");
        console.log("API Response Data:", response.data); 
        return response.data;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export default instance