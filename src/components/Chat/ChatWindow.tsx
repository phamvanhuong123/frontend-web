import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { chatApi } from "../../services/axios.chat";
import {
  Spin,
  Input,
  Button,
  Avatar,
  Empty,
  message,
  Badge,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  SendOutlined,
  SoundOutlined,
  BellOutlined,
  BellFilled,
} from "@ant-design/icons";
import "./ChatWindow.scss";

interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  senderName?: string;
  receiverName?: string;
  sentAt?: string;
  isRead?: boolean;
  chatId?: string;
}

interface Conversation {
  userId: string;
  userName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

const ChatWindow: React.FC = () => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Kết nối SignalR và lấy danh sách cuộc trò chuyện
  useEffect(() => {
    const connectSignalR = async () => {
      const conn = new signalR.HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_API_URL}/chathub`, {
          accessTokenFactory: () => localStorage.getItem("access_token") || "",
        })
        .withAutomaticReconnect()
        .build();

      conn.on("ReceiveMessage", (message: Message) => {
        console.log("Received message:", message);

        // Cập nhật tin nhắn nếu đang ở trong cuộc trò chuyện này
        if (
          selectedUserId &&
          (message.senderId === selectedUserId ||
            message.receiverId === selectedUserId)
        ) {
          setMessages((prev) => [...prev, message]);

          // Đánh dấu tin nhắn là đã đọc nếu đang mở cuộc trò chuyện
          if (message.senderId === selectedUserId) {
            chatApi.markAsRead(selectedUserId).catch((err) => {
              console.error("Error marking message as read:", err);
            });
          }
        }

        // Cập nhật danh sách cuộc trò chuyện và số tin nhắn chưa đọc
        fetchConversations();

        // Phát âm thông báo khi có tin nhắn mới
        const audio = new Audio("/message-sound.mp3");
        audio
          .play()
          .catch((err) =>
            console.error("Error playing notification sound:", err)
          );
      });

      try {
        await conn.start();
        console.log("Connected to SignalR");
        setConnection(conn);

        // Lấy danh sách cuộc trò chuyện
        fetchConversations();
      } catch (err) {
        console.error("SignalR connection error:", err);
        message.error("Không thể kết nối với server chat");
      } finally {
        setLoading(false);
      }
    };

    connectSignalR();

    // Định kỳ làm mới danh sách cuộc trò chuyện
    const intervalId = setInterval(() => {
      fetchConversations();
    }, 30000); // 30 giây

    return () => {
      clearInterval(intervalId);
      if (connection) {
        connection
          .stop()
          .catch((err) => console.error("SignalR disconnect error:", err));
      }
    };
  }, [selectedUserId]); // Thêm selectedUserId vào dependencies

  // Lấy danh sách cuộc trò chuyện từ API
  const fetchConversations = async () => {
    try {
      const res = await chatApi.getConversations();
      if (res.data) {
        setConversations(res.data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      message.error("Không thể tải danh sách cuộc trò chuyện");
    }
  };

  // Tự động scroll đến tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Khi chọn một người dùng để chat
  const handleSelectUser = async (userId: string) => {
    setSelectedUserId(userId);
    setLoading(true);
    setMessages([]);

    try {
      // Lấy chatId dựa vào userId
      const chatIdRes = await chatApi.getChatId(userId);
      const chatId = chatIdRes.data?.chatId;
      if (!chatId) throw new Error("Không tìm thấy chatId");

      setChatId(chatId);

      // Lấy tin nhắn
      const res = await chatApi.getConversationByChatId(chatId);
      if (res.data) {
        setMessages(res.data);

        // Tham gia SignalR
        if (connection) {
          try {
            await connection.invoke("JoinChat", chatId);
            console.log("Joined chat:", chatId);
          } catch (err) {
            console.error("Error joining chat:", err);
          }
        }

        // Đánh dấu đã đọc
        await chatApi.markAsRead(userId);
        fetchConversations();
      }
    } catch (error) {
      console.error("Error fetching conversation:", error);
      message.error("Không thể tải tin nhắn");
    } finally {
      setLoading(false);
    }
  };

  // Gửi tin nhắn
  const handleSendMessage = async () => {
    debugger;
    if (!newMessage.trim() || !selectedUserId) return;

    setSending(true);

    try {
      const messageToSend = {
        receiverId: selectedUserId,
        Content: newMessage,
        chatId: chatId || undefined,
      };

      console.log("Sending message:", messageToSend);

      const res = await chatApi.sendMessage(messageToSend);

      if (res?.data) {
        // Thêm tin nhắn vào danh sách
        const newMsg = res.data;
        setMessages((prev) => [...prev, newMsg]);

        // Cập nhật chatId nếu là tin nhắn đầu tiên
        if (!chatId && newMsg.chatId) {
          setChatId(newMsg.chatId);

          // Tham gia vào chat qua SignalR
          if (connection) {
            try {
              await connection.invoke("JoinChat", newMsg.chatId);
              console.log("Joined new chat:", newMsg.chatId);
            } catch (err) {
              console.error("Error joining new chat:", err);
            }
          }
        }

        setNewMessage("");

        // Cập nhật lại danh sách cuộc trò chuyện
        fetchConversations();
      }
    } catch (err) {
      console.error("Error sending message:", err);
      message.error("Không thể gửi tin nhắn");
    } finally {
      setSending(false);
    }
  };

  // Xử lý khi nhấn Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return (
        date.toLocaleDateString([], { day: "2-digit", month: "2-digit" }) +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    }
  };

  // time cho chhat
  const renderLastMessageTime = (timestamp?: string): string => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Hôm qua";
    } else if (days < 7) {
      const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
      return dayNames[date.getDay()];
    } else {
      return date.toLocaleDateString([], { day: "2-digit", month: "2-digit" });
    }
  };

  // Toggle sound notifications
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    localStorage.setItem("chat_sound_enabled", (!soundEnabled).toString());
  };

  // Load sound preference
  useEffect(() => {
    const savedPreference = localStorage.getItem("chat_sound_enabled");
    if (savedPreference !== null) {
      setSoundEnabled(savedPreference === "true");
    }
  }, []);

  return (
    <div className="admin-chat-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Cuộc trò chuyện</h3>
          <Tooltip title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}>
            <Button
              type="text"
              icon={soundEnabled ? <BellFilled /> : <BellOutlined />}
              onClick={toggleSound}
            />
          </Tooltip>
        </div>
        {loading && !conversations.length ? (
          <div className="loading-container">
            <Spin />
          </div>
        ) : conversations.length === 0 ? (
          <Empty description="Không có cuộc trò chuyện nào" />
        ) : (
          <ul>
            {conversations.map((c) => (
              <li
                key={c.userId}
                onClick={() => handleSelectUser(c.userId)}
                className={c.userId === selectedUserId ? "active" : ""}
              >
                <div className="conversation-item">
                  <Badge
                    dot={Boolean(c.unreadCount && c.unreadCount > 0)}
                    color="red"
                  >
                    <Avatar icon={<UserOutlined />} />
                  </Badge>
                  <div className="conversation-info">
                    <div className="name-row">
                      <div className="name">{c.userName}</div>
                      {c.lastMessageTime && (
                        <div className="time">
                          {renderLastMessageTime(c.lastMessageTime)}
                        </div>
                      )}
                    </div>
                    {c.lastMessage && (
                      <div className="last-message">
                        {c.lastMessage.length > 30
                          ? c.lastMessage.substring(0, 30) + "..."
                          : c.lastMessage}
                      </div>
                    )}
                  </div>
                  {c.unreadCount && c.unreadCount > 0 && (
                    <span className="unread-badge">{c.unreadCount}</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="chat-window">
        {selectedUserId ? (
          <>
            <div className="chat-header">
              <h3>
                {conversations.find((c) => c.userId === selectedUserId)
                  ?.userName || "Khách hàng"}
              </h3>
            </div>

            <div className="messages">
              {loading ? (
                <div className="loading-container">
                  <Spin tip="Đang tải tin nhắn..." />
                </div>
              ) : messages.length === 0 ? (
                <div className="empty-message">
                  <Empty description="Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!" />
                </div>
              ) : (
                <>
                  {[...messages]
                    .sort(
                      (a, b) =>
                        new Date(a.sentAt || "").getTime() -
                        new Date(b.sentAt || "").getTime()
                    )
                    .map((msg, idx, sortedMessages) => {
                      const isAdmin = msg.senderId !== selectedUserId;
                      const prevMsg = sortedMessages[idx - 1];
                      const showTime =
                        idx === 0 ||
                        (prevMsg &&
                          new Date(msg.sentAt || "").getTime() -
                            new Date(prevMsg.sentAt || "").getTime() >
                            5 * 60 * 1000);

                      return (
                        <React.Fragment key={msg.id || idx}>
                          {showTime && msg.sentAt && (
                            <div className="time-divider">
                              <span>{formatTime(msg.sentAt)}</span>
                            </div>
                          )}
                          <div
                            className={`message ${isAdmin ? "admin" : "user"}`}
                          >
                            <div className="message-content">
                              <div className="message-text">{msg.content}</div>
                              <div className="message-time">
                                {msg.sentAt &&
                                  new Date(msg.sentAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className="input-area">
              <Input.TextArea
                rows={2}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                disabled={loading || sending}
                autoFocus
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSendMessage}
                loading={sending}
                disabled={!newMessage.trim() || loading}
              >
                Gửi
              </Button>
            </div>
          </>
        ) : (
          <div className="no-user">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span>
                  Chọn một cuộc trò chuyện để bắt đầu <br />
                  hoặc đợi tin nhắn mới từ khách hàng
                </span>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
