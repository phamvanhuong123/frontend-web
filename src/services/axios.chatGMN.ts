import axios from "axios";
import { environment } from "../../environment";

class ChatGeminiService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = environment.geminiApiUrl; // Lấy URL từ environment
  }

  async askGemini(question: string): Promise<any> {
    try {
      const headers = {
        "Content-Type": "application/json",
      };

      const body = {
        contents: [{ parts: [{ text: question }] }], 
      };

      const response = await axios.post(this.apiUrl, body, { headers });
      return response.data;
    } catch (error: any) {
      console.error("Lỗi API Gemini:", error);
      throw new Error("Lỗi gọi Gemini API!");
    }
  }
}

export const chatGeminiService = new ChatGeminiService();