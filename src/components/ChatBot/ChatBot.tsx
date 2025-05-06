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

  // Khởi tạo chat khi component mount
  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      message.warning("Vui lòng đăng nhập để sử dụng tính năng chat");
      return;
    }

    initializeChat(user.id);

    return () => {
      // Đóng kết nối SignalR khi component unmount
      if (connectionRef.current) {
        connectionRef.current.stop().catch(err => console.error("Error stopping SignalR:", err));
      }
    };
  }, [isAuthenticated, user]);

  // Thiết lập SignalR khi có chatId
  useEffect(() => {
    if (chatId) {
      setupSignalR();
    }
  }, [chatId]);

  // Scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async (currentUserId: string) => {
    setLoading(true);
    try {
      // Tạo chat mới với nhân viên
      const chatRes = await chatApi.createStaffChat();
      if (!chatRes?.data) {
        throw new Error("Không thể tạo cuộc trò chuyện");
      }

      const chat = chatRes.data;
      setChatId(chat.id);

      // Tìm nhân viên hỗ trợ trong danh sách người tham gia
      if (chat.participants && chat.participants.length > 0) {
        const supportStaff = chat.participants.filter(
          (p: { userId: string }) => p.userId !== currentUserId
        );

        if (supportStaff.length > 0) {
          const firstStaff = supportStaff[0];
          setStaffId(firstStaff.userId);

          // Tải tin nhắn nếu có
          if (chat.messages && chat.messages.length > 0) {
            setMessages(chat.messages);
          } else {
            await fetchMessages(firstStaff.userId);
          }
        }
      }
    } catch (error) {
      console.error("Error initializing chat:", error);
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
        
            // Lấy tin nhắn
            const res = await chatApi.getConversationByChatId(chatId);
            if (res.data) {
              const formatted = res.data.map((m: Message) => ({
                ...m,
                content: m.content // 💡 mapping thủ công cho thống nhất
              }));
              setMessages(formatted);
            
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      message.error("Không thể tải tin nhắn");
    }
  };

  const setupSignalR = () => {
    if (!chatId || !localStorage.getItem("access_token")) return;

    // Tạo kết nối SignalR
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_URL}/chathub`, {
        accessTokenFactory: () => localStorage.getItem("access_token") || "",
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    // Xử lý sự kiện nhận tin nhắn
    connection.on("ReceiveMessage", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Kết nối và tham gia vào chat
    connection
      .start()
      .then(() => {
        console.log("SignalR connected");
        connection.invoke("JoinChat", chatId).catch(err => {
          console.error("Error joining chat:", err);
        });
      })
      .catch((err) => console.error("SignalR connection error:", err));

    connectionRef.current = connection;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !isAuthenticated) return;
  
    try {
      const messageData = {
        Content: newMessage, // ✅ đúng key backend mong đợi
        receiverId: staffId || undefined,
        chatId: chatId || undefined
      };
  
      const res = await chatApi.sendMessage(messageData);
  
      if (res?.data) {
        const sentMessage = res.data;
  
        // ✅ Hiển thị ngay trên giao diện
        setMessages((prev) => [...prev, sentMessage]);
  
        // ✅ Nếu lần đầu chat, lưu chatId lại
        if (!chatId && sentMessage.chatId) {
          setChatId(sentMessage.chatId);
  
          // ✅ Tham gia vào SignalR room nếu chưa
          if (connectionRef.current) {
            try {
              await connectionRef.current.invoke("JoinChat", sentMessage.chatId);
              console.log("Joined chat via SignalR:", sentMessage.chatId);
            } catch (err) {
              console.error("Error joining SignalR chat:", err);
            }
          }
        }
  
        setNewMessage(""); // ✅ Reset input
      }
    } catch (error) {
      console.error("Error sending message:", error);
      message.error("Không thể gửi tin nhắn");
    }
  };
  

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Nếu người dùng chưa đăng nhập
  if (!isAuthenticated || !user?.id) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <h3>Chat với nhân viên hỗ trợ</h3>
        </div>
        <div className="chat-messages" style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
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
          messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`message ${msg.senderId === user.id ? 'sent' : 'received'}`}
            >
              <Avatar
                icon={<UserOutlined />}
                style={{ backgroundColor: msg.senderId === user.id ? '#1890ff' : '#f56a00' }}
              />
              <div className="message-content">
                <div className="message-text">{msg.content}</div>
                <div className="message-time">
                  {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
