
import { Friend, FriendRequest, FriendGroup, ChatMessage, ChatThread } from '@/types/friend';

// Mock data for friends
export const mockFriends: Friend[] = [
  {
    id: 'friend1',
    displayName: 'Alex Johnson',
    email: 'alex@example.com',
    photoURL: 'https://i.pravatar.cc/150?u=1',
    status: 'online',
    lastActive: new Date(),
    productivity: {
      score: 85,
      screenTime: 320,
      productiveTime: 215,
      distractingTime: 65
    }
  },
  {
    id: 'friend2',
    displayName: 'Sam Taylor',
    email: 'sam@example.com',
    photoURL: 'https://i.pravatar.cc/150?u=2',
    status: 'away',
    lastActive: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    productivity: {
      score: 72,
      screenTime: 380,
      productiveTime: 185,
      distractingTime: 120
    }
  },
  {
    id: 'friend3',
    displayName: 'Jamie Lee',
    email: 'jamie@example.com',
    photoURL: 'https://i.pravatar.cc/150?u=3',
    status: 'offline',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    productivity: {
      score: 63,
      screenTime: 450,
      productiveTime: 210,
      distractingTime: 170
    }
  }
];

// Mock data for friend requests
export const mockFriendRequests: FriendRequest[] = [
  {
    id: 'req1',
    from: {
      id: 'user123',
      displayName: 'Chris Williams',
      email: 'chris@example.com',
      photoURL: 'https://i.pravatar.cc/150?u=4'
    },
    to: 'currentUser',
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  }
];

// Mock data for groups
export const mockGroups: FriendGroup[] = [
  {
    id: 'group1',
    name: 'Study Group',
    description: 'For our study sessions and productivity tracking',
    createdBy: 'currentUser',
    members: [mockFriends[0], mockFriends[1]],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  }
];

// Mock chat data
export const mockChats: ChatThread[] = [
  {
    id: 'chat1',
    participants: ['currentUser', 'friend1'],
    lastMessage: {
      id: 'msg3',
      senderId: 'friend1',
      senderName: 'Alex Johnson',
      content: "How's your productivity today?",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
      isRead: false
    },
    unreadCount: 1,
    isGroupChat: false,
    messages: [
      {
        id: 'msg1',
        senderId: 'currentUser',
        senderName: 'You',
        content: "Hey, how's it going?",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isRead: true
      },
      {
        id: 'msg2',
        senderId: 'friend1',
        senderName: 'Alex Johnson',
        content: 'Good, been working on that project!',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        isRead: true
      },
      {
        id: 'msg3',
        senderId: 'friend1',
        senderName: 'Alex Johnson',
        content: "How's your productivity today?",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
        isRead: false
      }
    ]
  },
  {
    id: 'chat2',
    participants: ['currentUser', 'friend2', 'friend3'],
    lastMessage: {
      id: 'gmsg2',
      senderId: 'friend2',
      senderName: 'Sam Taylor',
      content: "Let's try to beat our productivity scores this week!",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      isRead: true
    },
    unreadCount: 0,
    isGroupChat: true,
    groupName: 'Productivity Challenge',
    messages: [
      {
        id: 'gmsg1',
        senderId: 'currentUser',
        senderName: 'You',
        content: 'Hey everyone, I created this group for us to track our productivity together!',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        isRead: true
      },
      {
        id: 'gmsg2',
        senderId: 'friend2',
        senderName: 'Sam Taylor',
        content: "Let's try to beat our productivity scores this week!",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        isRead: true
      }
    ]
  }
];

// Helper function to generate random replies
export function getRandomReply(): string {
  const replies = [
    "Hey, how's your productivity going today?",
    "I just finished a deep work session. Feeling accomplished!",
    "Have you tried the new focus timer feature?",
    "My screen time is down 30% this week! The website blocker is really helping.",
    "Want to set up a productivity challenge?",
    "Just shared my productivity stats with you. Check it out!",
    "How's your schedule looking today?",
    "I'm having trouble staying focused. Any tips?",
    "The AI generated a great schedule for me today.",
    "Let's all try to reduce our distracting time this week!"
  ];
  
  return replies[Math.floor(Math.random() * replies.length)];
}
