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

  useEffect(() => {
    const connectSignalR = async () => {
      if (connection) return;

      const conn = new signalR.HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_API_URL}/chathub`, {
          accessTokenFactory: () => localStorage.getItem("access_token") || "",
        })
        .withAutomaticReconnect()
        .build();

      conn.on("ReceiveMessage", (message: Message) => {
        if (
          selectedUserId &&
          ((message.senderId === selectedUserId &&
            message.receiverId !== message.senderId) ||
            (message.receiverId === selectedUserId &&
              message.senderId !== selectedUserId))
        ) {
          setMessages((prevMessages) => {
            const messageExists = prevMessages.some((m) => m.id === message.id);
            if (messageExists) {
              return prevMessages;
            }
            return [...prevMessages, message];
          });

          if (message.senderId === selectedUserId) {
            chatApi.markAsRead(selectedUserId).catch((err) => {
              console.error("Lỗi không thể đọc:", err);
            });
          }
        }

        fetchConversations();

        // if (soundEnabled) {
        //   try {
        //     const audio = new Audio("/message-sound.mp3");
        //     audio.play().catch((err) =>
        //       console.error("Error playing notification sound:", err)
        //     );
        //   } catch (err) {
        //     console.error("Error with audio notification:", err);
        //   }
        // }
      });

      conn.onclose((error) => {
        console.log("SignalR connection closed", error);
        setTimeout(connectSignalR, 5000);
      });

      try {
        await conn.start();
        console.log("Connected to SignalR");
        setConnection(conn);

        if (chatId) {
          try {
            await conn.invoke("JoinChat", chatId);
            console.log("Joined chat:", chatId);
          } catch (err) {
            console.error("Lỗi:", err);
          }
        }

        fetchConversations();
      } catch (err) {
        console.error("SignalR Lỗi:", err);
        message.error("Không thể kết nối với server chat");
        setTimeout(connectSignalR, 5000);
      } finally {
        setLoading(false);
      }
    };

    connectSignalR();

    const intervalId = setInterval(() => {
      fetchConversations();
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (connection && chatId) {
      connection.invoke("JoinChat", chatId).catch((err) => {
        console.error("Lỗi:", err);
      });
    }
  }, [connection, chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async (chatId: string) => {
    try {
      const res = await chatApi.getConversationByChatId(chatId);
      if (res.data) {
        setMessages(res.data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      message.error("Không thể tải tin nhắn");
    }
  };

  const handleSelectUser = async (userId: string) => {
    setSelectedUserId(userId);
    setLoading(true);
    setMessages([]);

    try {
      const chatIdRes = await chatApi.getChatId(userId);
      const newChatId = chatIdRes.data?.chatId;

      if (!newChatId) {
        throw new Error("Không tìm thấy chatId");
      }

      setChatId(newChatId);

      await fetchMessages(newChatId);

      await chatApi.markAsRead(userId);

      fetchConversations();
    } catch (error) {
      console.error("Error fetching conversation:", error);
      message.error("Không thể tải tin nhắn");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId) return;

    setSending(true);

    const tempMessage: Message = {
      senderId: "me",
      receiverId: selectedUserId,
      content: newMessage,
      sentAt: new Date().toISOString(),
    };

    try {
      const messageToSend = {
        receiverId: selectedUserId,
        Content: newMessage,
        chatId: chatId || undefined,
      };

      setMessages((prevMessages) => [...prevMessages, tempMessage]);

      const res = await chatApi.sendMessage(messageToSend);

      if (res?.data) {
        setMessages((prevMessages) => {
          const filteredMessages = prevMessages.filter((m) => m !== tempMessage);
          return [...filteredMessages, res.data];
        });

        if (!chatId && res.data.chatId) {
          setChatId(res.data.chatId);
        }

        setNewMessage("");

        fetchConversations();
      }
    } catch (err) {
      console.error("Không thể gửi tin nhắn", err);
      message.error("Không thể gửi tin nhắn");

      setMessages((prevMessages) =>
        prevMessages.filter((m) => m !== tempMessage)
      );
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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

  const toggleSound = () => {
    const newSoundState = !soundEnabled;
    setSoundEnabled(newSoundState);
    localStorage.setItem("chat_sound_enabled", newSoundState.toString());
  };

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