
import { Friend, FriendRequest } from '@/types/friend';
import { mockFriends, mockFriendRequests } from './mock-data';
import { toast } from 'sonner';

export const friendsService = {
  // Get all friends
  getFriends: async (): Promise<Friend[]> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockFriends), 800);
    });
  },
  
  // Get friend requests
  getFriendRequests: async (): Promise<FriendRequest[]> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockFriendRequests), 600);
    });
  },
  
  // Send friend request
  sendFriendRequest: async (email: string): Promise<FriendRequest> => {
    // In a real app, this would be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (!email.includes('@')) {
          reject(new Error('Invalid email address'));
          return;
        }
        
        const newRequest: FriendRequest = {
          id: `req${Date.now()}`,
          from: {
            id: 'currentUser',
            displayName: 'Current User',
            email: 'current@example.com',
          },
          to: email,
          status: 'pending',
          createdAt: new Date()
        };
        
        mockFriendRequests.push(newRequest);
        resolve(newRequest);
      }, 1000);
    });
  },
  
  // Accept friend request
  acceptFriendRequest: async (requestId: string): Promise<Friend> => {
    // In a real app, this would be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const request = mockFriendRequests.find(req => req.id === requestId);
        if (!request) {
          reject(new Error('Friend request not found'));
          return;
        }
        
        const newFriend: Friend = {
          id: request.from.id,
          displayName: request.from.displayName,
          email: request.from.email,
          photoURL: request.from.photoURL,
          status: 'offline',
          lastActive: new Date(),
          productivity: {
            score: Math.floor(Math.random() * 30) + 60, // 60-90
            screenTime: Math.floor(Math.random() * 200) + 300, // 300-500 minutes
            productiveTime: Math.floor(Math.random() * 150) + 150, // 150-300 minutes
            distractingTime: Math.floor(Math.random() * 100) + 50 // 50-150 minutes
          }
        };
        
        mockFriends.push(newFriend);
        // Remove the request
        const index = mockFriendRequests.findIndex(req => req.id === requestId);
        if (index !== -1) {
          mockFriendRequests.splice(index, 1);
        }
        
        resolve(newFriend);
      }, 1000);
    });
  },
  
  // Decline friend request
  declineFriendRequest: async (requestId: string): Promise<void> => {
    // In a real app, this would be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockFriendRequests.findIndex(req => req.id === requestId);
        if (index === -1) {
          reject(new Error('Friend request not found'));
          return;
        }
        
        mockFriendRequests.splice(index, 1);
        resolve();
      }, 800);
    });
  },
  
  // Remove friend
  removeFriend: async (friendId: string): Promise<void> => {
    // In a real app, this would be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockFriends.findIndex(friend => friend.id === friendId);
        if (index === -1) {
          reject(new Error('Friend not found'));
          return;
        }
        
        mockFriends.splice(index, 1);
        resolve();
      }, 800);
    });
  },
  
  // Share productivity data with a friend
  shareProductivityData: async (targetId: string, data: any): Promise<void> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sharing productivity data with ${targetId}:`, data);
        toast.success('Productivity data shared successfully');
        resolve();
      }, 800);
    });
  },
};
