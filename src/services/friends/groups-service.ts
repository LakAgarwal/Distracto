
import { FriendGroup } from '@/types/friend';
import { mockGroups, mockFriends } from './mock-data';
import { ScreenTimeData } from '../screen-time-api';

export const groupsService = {
  // Get friend groups
  getFriendGroups: async (): Promise<FriendGroup[]> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockGroups), 800);
    });
  },
  
  // Create a new friend group
  createFriendGroup: async (name: string, description: string, memberIds: string[]): Promise<FriendGroup> => {
    // In a real app, this would be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!name) {
          reject(new Error('Group name is required'));
          return;
        }
        
        const selectedMembers = mockFriends.filter(friend => memberIds.includes(friend.id));
        
        const newGroup: FriendGroup = {
          id: `group${Date.now()}`,
          name,
          description,
          createdBy: 'currentUser',
          members: selectedMembers,
          createdAt: new Date()
        };
        
        mockGroups.push(newGroup);
        resolve(newGroup);
      }, 1000);
    });
  },
  
  // Share productivity data with a group
  shareGroupProductivityData: async (groupId: string, data: Partial<ScreenTimeData>): Promise<void> => {
    // In a real app, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Sharing productivity data with group ${groupId}:`, data);
        resolve();
      }, 800);
    });
  },
};
