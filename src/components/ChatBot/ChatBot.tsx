import { useState, useEffect, useRef } from "react";
import { Input, Button, Avatar, message, Spin } from "antd";
import { SendOutlined, UserOutlined, MessageOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { chatApi } from "../../services/axios.chat";
import * as signalR from "@microsoft/signalr";
import { RootState } from "../../redux/account/accountSlice";
import "./ChatBot.scss";

const { TextArea } = Input;

interface ChatBotProps {
  onNewMessage?: () => void; // Add prop to notify parent about new messages
}

interface Participant {
    userId: string;
}

interface Chat {
    id: string;
    title: string;
    participants: Participant[];
    messages: Message[];
}

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

const ChatBot = ({ onNewMessage }: ChatBotProps) => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.account);

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [staffId, setStaffId] = useState<string | null>(null);
    const [chatId, setChatId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const isInitializing = useRef(false);
    const isInitialized = useRef(false);
    const [chatInitialized, setChatInitialized] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !user?.id || chatInitialized) {
            setLoading(false);
            return;
        }

        if (isInitializing.current) {
            return;
        }

        isInitializing.current = true;

        const initializeChat = async (currentUserId: string) => {
            setLoading(true);
            try {
                const chatRes = await chatApi.createStaffChat();

                if (!chatRes?.data || !chatRes.data.id) {
                    throw new Error("Không thể tạo hoặc tìm thấy cuộc trò chuyện");
                }

                const chat: Chat = chatRes.data;
                setChatId(chat.id);

                const supportStaff = chat.participants.find(
                    (p: Participant) => p.userId !== currentUserId
                );

                if (supportStaff) {
                    setStaffId(supportStaff.userId);
                }

                if (chat.messages && chat.messages.length > 0) {
                    setMessages(chat.messages);
                } else {
                    setMessages([]);
                }

                isInitialized.current = true;
                setChatInitialized(true);
            } catch (error) {
                console.error("Error initializing chat:", error);
                message.error("Không thể kết nối với nhân viên hỗ trợ");
                setChatId(null);
                setStaffId(null);
            } finally {
                setLoading(false);
                isInitializing.current = false;
            }
        };

        initializeChat(user.id);
    }, [isAuthenticated, user, chatInitialized]);

    useEffect(() => {
        if (!chatId || !localStorage.getItem("access_token")) {
            if (connectionRef.current) {
                connectionRef.current.stop().catch(err => console.error("Error stopping old SignalR:", err));
                connectionRef.current = null;
            }
            return;
        }

        if (connectionRef.current && connectionRef.current.state !== signalR.HubConnectionState.Disconnected) {
            connectionRef.current.stop().catch(err => console.error("Error stopping existing SignalR:", err));
            connectionRef.current = null;
        }

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_API_URL}/chathub`, {
                accessTokenFactory: () => localStorage.getItem("access_token") || "",
            })
            .configureLogging(signalR.LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        connection.on("ReceiveMessage", (message: Message) => {
            setMessages((prevMessages) => {
                const messageExists = prevMessages.some(msg => msg.id === message.id);
                if (messageExists) {
                    return prevMessages;
                }
                if (message.chatId === chatId) {
                    if (message.senderId !== user?.id && onNewMessage) {
                        onNewMessage();
                    }
                    return [...prevMessages, message];
                }
                return prevMessages;
            });
        });

        connection.onreconnecting(error => {
            console.warn("SignalR reconnecting:", error);
        });

        connection.onreconnected(connectionId => {
            if (chatId && connection.state === signalR.HubConnectionState.Connected) {
                connection.invoke("JoinChat", chatId).catch(err => {
                    console.error("Error re-joining chat after reconnect:", err);
                });
            }
        });

        connection.onclose(error => {
            console.error("SignalR connection closed:", error);
        });

        connection
            .start()
            .then(() => {
                if (chatId && connection.state === signalR.HubConnectionState.Connected) {
                    connection.invoke("JoinChat", chatId).catch(err => {
                        console.error("Error joining chat:", err);
                    });
                }
            })
            .catch((err) => {
                console.error("SignalR connection error:", err);
            });

        connectionRef.current = connection;

        return () => {
            if (connection) {
                if (chatId && connection.state === signalR.HubConnectionState.Connected) {
                    connection.invoke("LeaveChat", chatId).catch(err => {
                        console.error("Error leaving chat on cleanup:", err);
                    });
                }
                connection.stop().catch(err => console.error("Error stopping SignalR on cleanup:", err));
                connectionRef.current = null;
            }
        };
    }, [chatId, user?.id, onNewMessage]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !isAuthenticated || !chatId) {
            if (!chatId) message.warning("Đang chờ kết nối chat, vui lòng đợi giây lát.");
            return;
        }

        const messageToSend = newMessage.trim();
        setNewMessage("");

        try {
            const messageData = {
                Content: messageToSend,
                ChatId: chatId,
                receiverId: staffId || undefined,
            };

            const res = await chatApi.sendMessage(messageData);

            if (!res?.data) {
                console.warn("API sent message but didn't return data.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            message.error("Không thể gửi tin nhắn");
            setNewMessage(messageToSend);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const sortedMessages = [...messages].sort((a, b) => {
        return new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime();
    });

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
                {loading && !chatId && !messages.length ? (
                     <div className="loading-container">
                         <Spin tip="Đang kết nối với nhân viên hỗ trợ..." />
                     </div>
                ) : messages.length === 0 && !loading && chatId ? (
                     <div className="welcome-message">
                         <MessageOutlined className="welcome-icon" />
                         <h3>Chào mừng bạn đến với hỗ trợ trực tuyến</h3>
                         <p>Hãy bắt đầu cuộc trò chuyện với nhân viên hỗ trợ của chúng tôi. 
                            Chúng tôi sẽ phản hồi trong thời gian sớm nhất!</p>
                     </div>
                ) : messages.length === 0 && !loading && !chatId && isInitialized.current ? (
                     <div className="empty-message">
                          <p>Không thể thiết lập cuộc trò chuyện lúc này.</p>
                     </div>
                ) : (
                    sortedMessages.map((msg, index) => (
                        <div
                            key={msg.id || index}
                            className={`message ${msg.senderId === user.id ? 'sent' : 'received'}`}
                        >
                            <Avatar
                                icon={<UserOutlined />}
                                style={{ backgroundColor: msg.senderId === user.id ? '#1890ff' : '#f56a00' }}
                                className={msg.senderId === user.id ? 'user-avatar' : 'staff-avatar'}
                            />
                            <div className="message-content">
                                <div className="message-text">{msg.content}</div>
                                <div className="message-time">
                                     {new Date(msg.sentAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
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
                    placeholder={loading || !chatId ? "Đang kết nối..." : "Nhập tin nhắn..."}
                    disabled={loading || !chatId}
                />
                <Button
                    type="primary"
                    onClick={handleSendMessage}
                    icon={<SendOutlined />}
                    disabled={loading || !newMessage.trim() || !chatId}
                >
                    Gửi
                </Button>
            </div>
        </div>
    );
};

export default ChatBot;