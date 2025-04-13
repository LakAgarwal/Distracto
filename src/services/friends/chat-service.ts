
import { ChatMessage, ChatThread } from '@/types/friend';
import { mockChats, getRandomReply } from './mock-data';

export const chatService = {
  // Get all chat threads for the current user
  getChatThreads: async (): Promise<ChatThread[]> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockChats), 800);
    });
  },
  
  // Get a specific chat thread by ID
  getChatThread: async (chatId: string): Promise<ChatThread> => {
    // In a real app, this would be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const chat = mockChats.find(c => c.id === chatId);
        if (!chat) {
          reject(new Error('Chat thread not found'));
          return;
        }
        resolve(chat);
      }, 600);
    });
  },
  
  // Send a message in a chat thread
  sendMessage: async (chatId: string, content: string): Promise<ChatMessage> => {
    // In a real app, this would be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const chatIndex = mockChats.findIndex(c => c.id === chatId);
        if (chatIndex === -1) {
          reject(new Error('Chat thread not found'));
          return;
        }
        
        const newMessage: ChatMessage = {
          id: `msg${Date.now()}`,
          senderId: 'currentUser',
          senderName: 'You',
          content: content,
          timestamp: new Date(),
          isRead: true
        };
        
        // Add message to the chat
        mockChats[chatIndex].messages.push(newMessage);
        mockChats[chatIndex].lastMessage = newMessage;
        
        // In a mock environment, simulate a reply after a delay
        setTimeout(() => {
          if (Math.random() > 0.3) { // 70% chance of getting a reply
            const replyMessage: ChatMessage = {
              id: `msg${Date.now() + 1}`,
              senderId: mockChats[chatIndex].participants.find(p => p !== 'currentUser') || 'friend1',
              senderName: mockChats[chatIndex].isGroupChat 
                ? `Group Member` 
                : mockChats[chatIndex].participants.find(p => p !== 'currentUser') === 'friend1' 
                  ? 'Alex Johnson' 
                  : 'Sam Taylor',
              content: getRandomReply(),
              timestamp: new Date(),
              isRead: false
            };
            
            mockChats[chatIndex].messages.push(replyMessage);
            mockChats[chatIndex].lastMessage = replyMessage;
            mockChats[chatIndex].unreadCount += 1;
          }
        }, 3000);
        
        resolve(newMessage);
      }, 800);
    });
  },
  
  // Create a new chat thread
  createChatThread: async (
    participantIds: string[], 
    isGroup: boolean = false, 
    groupName?: string
  ): Promise<ChatThread> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newThread: ChatThread = {
          id: `chat${Date.now()}`,
          participants: ['currentUser', ...participantIds],
          unreadCount: 0,
          isGroupChat: isGroup,
          groupName: isGroup ? groupName : undefined,
          messages: []
        };
        
        mockChats.unshift(newThread);
        resolve(newThread);
      }, 1000);
    });
  },
  
  // Mark messages as read
  markAsRead: async (chatId: string): Promise<void> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const chatIndex = mockChats.findIndex(c => c.id === chatId);
        if (chatIndex !== -1) {
          mockChats[chatIndex].unreadCount = 0;
          mockChats[chatIndex].messages.forEach(msg => {
            msg.isRead = true;
          });
        }
        resolve();
      }, 500);
    });
  }
};
