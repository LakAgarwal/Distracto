import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authAPI, userAPI } from '@/services/api';

export interface UserPreferences {
  goal?: string;
  occupation?: string;
  college?: string;
  interests?: string[];
  distractoId?: string;
}

export interface User {
  _id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  preferences?: UserPreferences;
  followers?: string[];
  following?: string[];
  isBot?: boolean;
  botType?: 'assistant' | 'productivity' | 'meditation';
  lastActive?: Date;
  isOnline?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (profile: Partial<User>) => Promise<void>;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        // Optionally verify token with server
        userAPI.getProfile()
          .then(userData => {
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          })
          .catch(() => {
            // Token is invalid, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
          });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to login';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register(email, password, displayName);
      
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      
      toast.success('Registered successfully');
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to register';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  const updateUserProfile = async (profile: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = await userAPI.updateProfile(profile);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      throw error;
    }
  };

  const updateUserPreferences = async (preferences: Partial<UserPreferences>) => {
    if (!user) return;
    
    try {
      const updatedUser = await userAPI.updateProfile({ preferences });
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Preferences updated successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update preferences';
      toast.error(message);
      throw error;
    }
  };

  const followUser = async (userId: string) => {
    try {
      await userAPI.followUser(userId);
      
      // Update local state
      if (user) {
        const updatedUser = {
          ...user,
          following: [...(user.following || []), userId]
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      toast.success('User followed successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to follow user';
      toast.error(message);
      throw error;
    }
  };

  const unfollowUser = async (userId: string) => {
    try {
      await userAPI.unfollowUser(userId);
      
      // Update local state
      if (user) {
        const updatedUser = {
          ...user,
          following: (user.following || []).filter(id => id !== userId)
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      toast.success('User unfollowed successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to unfollow user';
      toast.error(message);
      throw error;
    }
  };

  const isFollowing = (userId: string): boolean => {
    return user?.following?.includes(userId) || false;
  };

  const getFollowers = (): User[] => {
    // This would need to be implemented with actual API calls
    return [];
  };

  const getFollowing = (): User[] => {
    // This would need to be implemented with actual API calls
    return [];
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