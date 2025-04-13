
import { Friend, FriendRequest, FriendGroup, ChatMessage, ChatThread } from '@/types/friend';
import { ScreenTimeData } from './screen-time-api';
import { friendsService } from './friends/friends-service';
import { groupsService } from './friends/groups-service';
import { chatService } from './friends/chat-service';

// Exporting the combined API for backward compatibility
export const friendsAPI = {
  // Friends methods
  getFriends: friendsService.getFriends,
  getFriendRequests: friendsService.getFriendRequests,
  sendFriendRequest: friendsService.sendFriendRequest,
  acceptFriendRequest: friendsService.acceptFriendRequest,
  declineFriendRequest: friendsService.declineFriendRequest,
  removeFriend: friendsService.removeFriend,
  
  // Groups methods
  getFriendGroups: groupsService.getFriendGroups,
  createFriendGroup: groupsService.createFriendGroup,
  
  // Chat methods
  getChatThreads: chatService.getChatThreads,
  getChatThread: chatService.getChatThread,
  sendMessage: chatService.sendMessage,
  createChatThread: chatService.createChatThread,
  
  // Productivity sharing
  shareProductivityData: async (targetId: string, data: any): Promise<void> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sharing productivity data with ${targetId}:`, data);
        resolve();
      }, 800);
    });
  },
};
