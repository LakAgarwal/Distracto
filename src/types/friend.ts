
export interface Friend {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  status: 'online' | 'offline' | 'away';
  lastActive?: Date;
  productivity?: {
    score: number; // 0-100
    screenTime: number; // in minutes
    productiveTime: number; // in minutes
    distractingTime: number; // in minutes
  }
}

export interface FriendRequest {
  id: string;
  from: {
    id: string;
    displayName: string;
    email: string;
    photoURL?: string;
  };
  to: string; // User ID
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

export interface FriendGroup {
  id: string;
  name: string;
  description?: string;
  createdBy: string; // User ID
  members: Friend[];
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  attachments?: string[];
  isRead: boolean;
}

export interface ChatThread {
  id: string;
  participants: string[]; // User IDs
  lastMessage?: ChatMessage;
  unreadCount: number;
  isGroupChat: boolean;
  groupName?: string;
  messages: ChatMessage[];
}
