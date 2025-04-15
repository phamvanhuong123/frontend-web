
import { instance } from "./axios.customize";


export const getCategory = async () => {
    debugger
    try {
        const response = await instance.get("/api/v1/ecommerce/categorys");
        console.log("API Response Data:", response.data); 
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

