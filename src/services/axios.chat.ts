import axios from 'axios';

const BASE_URL = 'https://localhost:7074/api';

export const chatApi = {
    sendMessage: async (message: string) => {
        const response = await axios.post(`${BASE_URL}/chat`, { message });
        return response.data;
    },

    getChatHistory: async () => {
        const response = await axios.get(`${BASE_URL}/chat/history`);
        return response.data;
    }
}; 