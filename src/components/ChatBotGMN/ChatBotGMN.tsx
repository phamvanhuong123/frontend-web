import { useState, useEffect, useRef } from "react";
import { Input, Button, Avatar, message, Spin } from "antd";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { chatApi } from "../../services/axios.chat";
import * as signalR from "@microsoft/signalr";
import { RootState } from "../../redux/account/accountSlice";
import "./ChatBot.scss";

const { TextArea } = Input;

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId?: string;
  senderName?: string;
  sentAt: string;
  chatId?: string;
  isRead?: boolean;
}

const ChatBot = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.account);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [staffId, setStaffId] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  // Scroll khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Khởi tạo chat khi đăng nhập
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      message.warning("Vui lòng đăng nhập để sử dụng tính năng chat");
      return;
    }

    initializeChat(user.id);

    return () => {
      connectionRef.current?.stop().catch(console.error);
    };
  }, [isAuthenticated, user]);

  // Kết nối SignalR sau khi có chatId
  useEffect(() => {
    if (chatId) setupSignalR();
  }, [chatId]);

  const initializeChat = async (currentUserId: string) => {
    setLoading(true);
    try {
      const chatRes = await chatApi.createStaffChat();
      if (!chatRes?.data) throw new Error("Không thể tạo cuộc trò chuyện");

      const chat = chatRes.data;
      setChatId(chat.id);

      const supportStaff = chat.participants?.find((p: { userId: string }) => p.userId !== currentUserId);
      if (supportStaff) {
        setStaffId(supportStaff.userId);

        if (chat.messages?.length > 0) {
          setMessages(chat.messages);
        } else {
          await fetchMessages(supportStaff.userId);
        }
      }
    } catch (err) {
      console.error("Init chat error:", err);
      message.error("Không thể kết nối với nhân viên hỗ trợ");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (staffUserId: string) => {
    try {
      const chatIdRes = await chatApi.getChatId(staffUserId);
      const chatId = chatIdRes.data?.chatId;
      if (!chatId) throw new Error("Không tìm thấy chatId");

      setChatId(chatId);
      const res = await chatApi.getConversationByChatId(chatId);
      if (res.data) setMessages(res.data);
    } catch (err) {
      console.error("Lỗi tải tin nhắn:", err);
      message.error("Không thể tải tin nhắn");
    }
  };

  const setupSignalR = () => {
    if (!chatId || !localStorage.getItem("access_token")) return;

    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_URL}/chathub`, {
        accessTokenFactory: () => localStorage.getItem("access_token") || "",
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    conn.on("ReceiveMessage", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    conn
      .start()
      .then(() => conn.invoke("JoinChat", chatId))
      .catch((err) => console.error("SignalR error:", err));

    connectionRef.current = conn;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isAuthenticated) return;

    try {
      const payload = {
        Content: newMessage,
        receiverId: staffId || undefined,
        chatId: chatId || undefined
      };

      const res = await chatApi.sendMessage(payload);
      if (res?.data) {
        setMessages((prev) => [...prev, res.data]);

        if (!chatId && res.data.chatId) {
          setChatId(res.data.chatId);
          connectionRef.current?.invoke("JoinChat", res.data.chatId).catch(console.error);
        }

        setNewMessage("");
      }
    } catch (err) {
      console.error("Send message error:", err);
      message.error("Không thể gửi tin nhắn");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isAuthenticated || !user?.id) {
    return (
      <div className="chat-container">
        <div className="chat-header"><h3>Chat với nhân viên hỗ trợ</h3></div>
        <div className="chat-messages center-message">
          <p>Vui lòng đăng nhập để sử dụng tính năng chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat với nhân viên hỗ trợ</h3>
      </div>

      <div className="chat-messages">
        {loading ? (
          <div className="loading-container">
            <Spin tip="Đang kết nối với nhân viên hỗ trợ..." />
          </div>
        ) : messages.length === 0 ? (
          <div className="empty-message">
            <p>Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messages
            .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime())
            .map((msg, index) => (
              <div
                key={msg.id || index}
                className={`message ${msg.senderId === user.id ? "sent" : "received"}`}
              >
                <Avatar
                  icon={<UserOutlined />}
                  style={{ backgroundColor: msg.senderId === user.id ? "#1890ff" : "#f56a00" }}
                />
                <div className="message-content">
                  <div className="message-text">{msg.content}</div>
                  <div className="message-time">
                    {new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <TextArea
          rows={2}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn..."
          disabled={loading}
        />
        <Button
          type="primary"
          onClick={handleSendMessage}
          icon={<SendOutlined />}
          disabled={loading || !newMessage.trim()}
        >
          Gửi
        </Button>
      </div>
    </div>
  );
};

export default ChatBot;
