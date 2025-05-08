import instance from "./axios.customize";
const url = "api/v1/ecommerce/chat";
export const chatApi = {
  // // Lấy cuộc trò chuyện với một người dùng cụ thể
  // getConversation: (userId: string) => {
  //   return instance.get(`/api/v1/ecommerce/chat/conversation/${userId}`);
  // },

  // // Lấy số lượng tin nhắn chưa đọc
  // getUnreadCount: () => {
  //   return instance.get(`/api/v1/ecommerce/chat/unread-count`);
  // },

  // // Lấy danh sách nhân viên hỗ trợ
  // getStaffMembers: () => {
  //   return instance.get(`/api/v1/ecommerce/chat/staff`);
  // },

  // // Lấy danh sách khách hàng (dành cho nhân viên)
  // getCustomers: () => {
  //   return instance.get(`/api/v1/ecommerce/chat/customers`);
  // },
  // Gửi tin nhắn
  sendMessage: (data: {
    Content: string;
    receiverId?: string;
    chatId?: string;
  }) => {
    return instance.post(`${url}/send`, data);
  },

  //Lấy tất cả cuộc trò chuyện của người dùng hiện tại
  getConversations: () => {
    return instance.get(`${url}/conversations`);
  },
  // Đánh dấu tin nhắn là đã đọc
  markAsRead: (userId: string) => {
    return instance.post(`${url}/mark-read/${userId}`);
  },
  // Tạo cuộc trò chuyện với nhân viên hỗ trợ
  createStaffChat: () => {
    return instance.post(`${url}/create-staff-chat`);
  },
  // Lấy id chat qua id userư
  getChatId: (userId: string) => {
    return instance.get(`${url}/chat-id-with/${userId}`);
  },
  //lấy cuộc trò chuyện dựa vào chat id
  getConversationByChatId: (chatId: string) => {
    return instance.get(`${url}/messages/${chatId}`);
  },
};
