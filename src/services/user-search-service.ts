
import { User, UserPreferences } from '@/hooks/useAuth';

// Mock user data for search functionality
const mockUsers: User[] = [
  {
    id: 'user1',
    email: 'john@example.com',
    displayName: 'John Smith',
    photoURL: 'https://i.pravatar.cc/150?u=5',
    preferences: {
      distractoId: 'johnsmith',
      goal: 'Reduce screen time',
      occupation: 'Software Developer',
      college: 'MIT',
      interests: ['Technology', 'Productivity', 'Reading']
    }
  },
  {
    id: 'user2',
    email: 'lisa@example.com',
    displayName: 'Lisa Johnson',
    photoURL: 'https://i.pravatar.cc/150?u=6',
    preferences: {
      distractoId: 'lisaj',
      goal: 'Better focus',
      occupation: 'UX Designer',
      college: 'Stanford',
      interests: ['Design', 'Art', 'Meditation']
    }
  },
  {
    id: 'user3',
    email: 'mike@example.com',
    displayName: 'Mike Williams',
    photoURL: 'https://i.pravatar.cc/150?u=7',
    preferences: {
      distractoId: 'mikew',
      goal: 'Work-life balance',
      occupation: 'Project Manager',
      college: 'Harvard',
      interests: ['Time Management', 'Leadership', 'Health']
    }
  },
  {
    id: 'user4',
    email: 'sarah@example.com',
    displayName: 'Sarah Chen',
    photoURL: 'https://i.pravatar.cc/150?u=8',
    preferences: {
      distractoId: 'sarahc',
      goal: 'Reduce screen time',
      occupation: 'Digital Marketer',
      college: 'NYU',
      interests: ['Digital Detox', 'Marketing', 'Psychology']
    }
  },
  {
    id: 'user5',
    email: 'david@example.com',
    displayName: 'David Wilson',
    photoURL: 'https://i.pravatar.cc/150?u=9',
    preferences: {
      distractoId: 'davidw',
      goal: 'Better focus',
      occupation: 'Data Scientist',
      college: 'UC Berkeley',
      interests: ['AI', 'Deep Work', 'Statistics']
    }
  },
  {
    id: 'user6',
    email: 'piyush@example.com',
    displayName: 'Piyush Sharma',
    photoURL: 'https://i.pravatar.cc/150?u=10',
    preferences: {
      distractoId: 'piyushs',
      goal: 'Digital wellbeing',
      occupation: 'Software Engineer',
      college: 'IIT Delhi',
      interests: ['Coding', 'AI', 'Productivity']
    }
  },
  {
    id: 'user7',
    email: 'patricia@example.com',
    displayName: 'Patricia Lopez',
    photoURL: 'https://i.pravatar.cc/150?u=11',
    preferences: {
      distractoId: 'patricial',
      goal: 'Focus improvement',
      occupation: 'Content Creator',
      college: 'UCLA',
      interests: ['Writing', 'Social Media', 'Photography']
    }
  },
  {
    id: 'user8',
    email: 'priya@example.com',
    displayName: 'Priya Patel',
    photoURL: 'https://i.pravatar.cc/150?u=12',
    preferences: {
      distractoId: 'priyap',
      goal: 'Screen time management',
      occupation: 'UI Designer',
      college: 'RISD',
      interests: ['Design', 'Illustration', 'UX Research']
    }
  }
];

export const userSearchService = {
  // Search users by DistractoID
  searchByDistractoId: async (query: string): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = mockUsers.filter(user => 
          user.preferences?.distractoId?.toLowerCase().includes(query.toLowerCase())
        );
        resolve(results);
      }, 800);
    });
  },
  
  // Auto-suggest users as you type (by name or DistractoID)
  autoSuggestUsers: async (query: string): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!query || query.trim() === '') {
          resolve([]);
          return;
        }
        
        const queryLower = query.toLowerCase();
        const results = mockUsers.filter(user => 
          user.displayName.toLowerCase().startsWith(queryLower) || 
          user.preferences?.distractoId?.toLowerCase().startsWith(queryLower)
        );
        resolve(results);
      }, 300); // Faster response time for auto-suggestions
    });
  },
  
  // Search users by preferences (goal, occupation, college, interests)
  searchByPreferences: async (preferences: Partial<UserPreferences>): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...mockUsers];
        
        if (preferences.goal) {
          results = results.filter(user => 
            user.preferences?.goal?.toLowerCase() === preferences.goal?.toLowerCase()
          );
        }
        
        if (preferences.occupation) {
          results = results.filter(user => 
            user.preferences?.occupation?.toLowerCase() === preferences.occupation?.toLowerCase()
          );
        }
        
        if (preferences.college) {
          results = results.filter(user => 
            user.preferences?.college?.toLowerCase() === preferences.college?.toLowerCase()
          );
        }
        
        if (preferences.interests && preferences.interests.length > 0) {
          results = results.filter(user => 
            preferences.interests?.some(interest => 
              user.preferences?.interests?.includes(interest)
            )
          );
        }
        
        resolve(results);
      }, 1000);
    });
  },
  
  // Get recommended users based on similar preferences
  getRecommendedUsers: async (userId: string): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would use more sophisticated recommendation algorithms
        // For now, just return other users that aren't the current user
        const recommended = mockUsers.filter(user => user.id !== userId);
        resolve(recommended);
      }, 1200);
    });
  }
};
