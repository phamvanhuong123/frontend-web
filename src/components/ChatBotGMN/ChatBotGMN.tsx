import React, { useState } from "react";
import { chatGeminiService } from "~/services/axios.chatGMN"; // Import service để gọi API Gemini
import "./ChatBotGMN.scss"; // Import file CSS nếu cần

const ChatBotGMN = () => {
  const [userMessage, setUserMessage] = useState(""); // Tin nhắn của người dùng
  const [chatHistory, setChatHistory] = useState<{ user: string; bot: string }[]>([]); // Lịch sử chat
  const [loading, setLoading] = useState(false); // Trạng thái loading khi chờ phản hồi từ bot

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    const userText = userMessage;
    setChatHistory((prev) => [...prev, { user: userText, bot: "..." }]); // Hiển thị tin nhắn của người dùng
    setUserMessage(""); // Xóa nội dung input
    setLoading(true);

    try {
      const response = await chatGeminiService.askGemini(userText); // Gọi API Gemini
      const reply =
        response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Xin lỗi, tôi không hiểu."; // Lấy phản hồi từ API
      setChatHistory((prev) => {
        const updatedHistory = [...prev];
        updatedHistory[updatedHistory.length - 1].bot = reply; // Cập nhật phản hồi của bot
        return updatedHistory;
      });
    } catch (error) {
      console.error("Lỗi API Gemini:", error);
      setChatHistory((prev) => {
        const updatedHistory = [...prev];
        updatedHistory[updatedHistory.length - 1].bot = "Lỗi kết nối AI!";
        return updatedHistory;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">Chat với Gemini</div>
      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index} className="chat-message">
            <div className="user-message">
              <strong>Bạn:</strong> {chat.user}
            </div>
            <div className="bot-message">
              <strong>Bot:</strong> {chat.bot}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()} // Gửi tin nhắn khi nhấn Enter
        />
        <button onClick={sendMessage} disabled={loading || !userMessage.trim()}>
          {loading ? "Đang gửi..." : "Gửi"}
        </button>
      </div>
    </div>
  );
};

export default ChatBotGMN;
