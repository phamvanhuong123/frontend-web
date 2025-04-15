import { instance } from "./axios.customize";

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