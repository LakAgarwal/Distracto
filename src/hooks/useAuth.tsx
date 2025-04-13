
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export interface UserPreferences {
  goal?: string;
  occupation?: string;
  college?: string;
  interests?: string[];
  distractoId?: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferences?: UserPreferences;
  followers?: string[];
  following?: string[];
  isBot?: boolean;
  botType?: 'assistant' | 'productivity' | 'meditation';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (profile: Partial<User>) => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  getFollowers: () => User[];
  getFollowing: () => User[];
  isFollowing: (userId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock bots data
const BOTS: User[] = [
  {
    id: 'bot1',
    email: 'focus.bot@distracto.com',
    displayName: 'Focus Bot',
    photoURL: 'https://i.pravatar.cc/150?u=bot1',
    isBot: true,
    botType: 'productivity',
    preferences: {
      distractoId: 'focusbot',
      goal: 'Help you stay focused on your tasks',
      occupation: 'Productivity Bot',
      interests: ['Focus', 'Productivity', 'Time management']
    }
  },
  {
    id: 'bot2',
    email: 'calm.bot@distracto.com',
    displayName: 'Calm Mind',
    photoURL: 'https://i.pravatar.cc/150?u=bot2',
    isBot: true,
    botType: 'meditation',
    preferences: {
      distractoId: 'calmbot',
      goal: 'Guide you through meditation sessions',
      occupation: 'Meditation Bot',
      interests: ['Meditation', 'Mindfulness', 'Mental health']
    }
  },
  {
    id: 'bot3',
    email: 'stats.bot@distracto.com',
    displayName: 'Stats Assistant',
    photoURL: 'https://i.pravatar.cc/150?u=bot3',
    isBot: true,
    botType: 'assistant',
    preferences: {
      distractoId: 'statsbot',
      goal: 'Help you analyze your productivity stats',
      occupation: 'Analytics Bot',
      interests: ['Data', 'Analytics', 'Optimization']
    }
  }
];

// Mock users data
const MOCK_USERS: User[] = [
  {
    id: 'user1',
    displayName: 'John Smith',
    email: 'john@example.com',
    photoURL: 'https://i.pravatar.cc/150?u=1',
    preferences: {
      distractoId: 'johnsmith',
      goal: 'Reduce screen time by 30%',
      occupation: 'Software Developer',
      interests: ['Coding', 'Productivity', 'Reading']
    }
  },
  {
    id: 'user2',
    displayName: 'Sarah Chen',
    email: 'sarah@example.com',
    photoURL: 'https://i.pravatar.cc/150?u=2',
    preferences: {
      distractoId: 'sarahchen',
      goal: 'Better work-life balance',
      occupation: 'Product Manager',
      interests: ['Design', 'Hiking', 'Photography']
    }
  },
  {
    id: 'user3',
    displayName: 'Mike Williams',
    email: 'mike@example.com',
    photoURL: 'https://i.pravatar.cc/150?u=3',
    preferences: {
      distractoId: 'mikewilliams',
      goal: 'Focus on deep work',
      occupation: 'UX Designer',
      interests: ['UI/UX', 'Art', 'Music']
    }
  },
  {
    id: 'user4',
    displayName: 'Lisa Johnson',
    email: 'lisa@example.com',
    photoURL: 'https://i.pravatar.cc/150?u=4',
    preferences: {
      distractoId: 'lisaj',
      goal: 'Improve focus during work hours',
      occupation: 'Marketing Specialist',
      interests: ['Marketing', 'Social media', 'Writing']
    }
  }
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // This is a simplified mock login
      // In a real app, you would call an authentication API

      // Simple validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const mockUser = {
        id: '123456',
        email,
        displayName: email.split('@')[0],
        preferences: {
          distractoId: email.split('@')[0].toLowerCase(),
        },
        followers: ['bot1', 'user2'],  // Bot1 and Sarah are following the user by default
        following: [],
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    try {
      // This is a simplified mock registration
      // In a real app, you would call an authentication API

      // Simple validation
      if (!email || !password || !displayName) {
        throw new Error('All fields are required');
      }

      const mockUser = {
        id: '123456',
        email,
        displayName,
        preferences: {
          distractoId: displayName.toLowerCase().replace(/\s+/g, ''),
        },
        followers: ['bot1', 'bot3'],  // Some bots follow new users by default
        following: [],
      };

      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      toast.success('Registered successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to register');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('openai_api_key');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const updateUserProfile = (profile: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...profile };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const updateUserPreferences = (preferences: Partial<UserPreferences>) => {
    if (user) {
      const updatedPreferences = { ...user.preferences, ...preferences };
      const updatedUser = { ...user, preferences: updatedPreferences };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const isFollowing = (userId: string): boolean => {
    return user?.following?.includes(userId) || false;
  };

  const followUser = async (userId: string): Promise<void> => {
    if (!user) return;

    try {
      // In a real app, this would be an API call
      const updatedFollowing = [...(user.following || [])];
      if (!updatedFollowing.includes(userId)) {
        updatedFollowing.push(userId);
      }

      const updatedUser = { ...user, following: updatedFollowing };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('User followed successfully');
    } catch (error) {
      toast.error('Failed to follow user');
      throw error;
    }
  };

  const unfollowUser = async (userId: string): Promise<void> => {
    if (!user) return;

    try {
      // In a real app, this would be an API call
      const updatedFollowing = (user.following || []).filter(id => id !== userId);
      const updatedUser = { ...user, following: updatedFollowing };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('User unfollowed successfully');
    } catch (error) {
      toast.error('Failed to unfollow user');
      throw error;
    }
  };

  // Updated followers and following methods
  const getFollowers = (): User[] => {
    if (!user || !user.followers) return [];
    
    // Get all followers, including bots
    const followerIds = user.followers || [];
    const botFollowers = BOTS.filter(bot => followerIds.includes(bot.id));
    const userFollowers = MOCK_USERS.filter(mockUser => followerIds.includes(mockUser.id));
    
    return [...botFollowers, ...userFollowers];
  };

  const getFollowing = (): User[] => {
    if (!user || !user.following) return [];
    
    // Get all users being followed
    const followingIds = user.following || [];
    const botFollowing = BOTS.filter(bot => followingIds.includes(bot.id));
    const userFollowing = MOCK_USERS.filter(mockUser => followingIds.includes(mockUser.id));
    
    return [...botFollowing, ...userFollowing];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUserProfile,
        updateUserPreferences,
        followUser,
        unfollowUser,
        getFollowers,
        getFollowing,
        isFollowing
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
