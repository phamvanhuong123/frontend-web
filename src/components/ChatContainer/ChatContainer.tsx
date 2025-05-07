import { useState } from "react";
import ChatBotGMN from "../ChatBotGMN/ChatBotGMN"; // Import component ChatBotGMN
import ChatBot from "../ChatBot/ChatBot"; // Import component ChatBot
import { Button } from "antd";

const ChatContainer = () => {
  // State để lưu lựa chọn của người dùng
  const [selectedChatMode, setSelectedChatMode] = useState<'gmn' | 'default'>('gmn');

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chọn chế độ chat</h3>
        {/* Tạo nút để người dùng chọn chế độ */}
        <Button onClick={() => setSelectedChatMode('gmn')} disabled={selectedChatMode === 'gmn'}>
          Chat GMN
        </Button>
        <Button onClick={() => setSelectedChatMode('default')} disabled={selectedChatMode === 'default'}>
          Chat Default
        </Button>
      </div>

      {/* Dựa trên lựa chọn của người dùng, hiển thị component tương ứng */}
      {selectedChatMode === 'gmn' ? <ChatBotGMN /> : <ChatBot />}
    </div>
  );
};

export default ChatContainer;
