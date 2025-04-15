import axios from "axios";

export const instance = axios.create({
    baseURL: "http://localhost:5000"
});

export const getUsers = async () => {
    debugger
    try {
        const response = await instance.get("/api/v1/ecommerce/users");
        console.log("API Response Data:", response.data); 
        return response.data;
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