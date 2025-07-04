import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (email: string, password: string, displayName: string) => {
    const response = await api.post('/auth/register', { email, password, displayName });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (data: any) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
  
  searchUsers: async (query: string, type = 'all') => {
    const response = await api.get(`/users/search?q=${query}&type=${type}`);
    return response.data;
  },
  
  followUser: async (userId: string) => {
    const response = await api.post(`/users/follow/${userId}`);
    return response.data;
  },
  
  unfollowUser: async (userId: string) => {
    const response = await api.delete(`/users/follow/${userId}`);
    return response.data;
  }
};

// Screen Time API
export const screenTimeAPI = {
  getScreenTime: async (date?: string) => {
    const endpoint = date ? `/screen-time/${date}` : '/screen-time';
    const response = await api.get(endpoint);
    return response.data;
  },
  
  updateScreenTime: async (data: any, date?: string) => {
    const endpoint = date ? `/screen-time/${date}` : '/screen-time';
    const response = await api.put(endpoint, data);
    return response.data;
  },
  
  getWeeklyData: async (startDate: string) => {
    const response = await api.get(`/screen-time/weekly/${startDate}`);
    return response.data;
  }
};

// Website Blocker API
export const websiteBlockerAPI = {
  getBlockedSites: async () => {
    const response = await api.get('/website-blocker');
    return response.data;
  },
  
  addBlockedSite: async (data: any) => {
    const response = await api.post('/website-blocker', data);
    return response.data;
  },
  
  updateBlockedSite: async (id: string, data: any) => {
    const response = await api.put(`/website-blocker/${id}`, data);
    return response.data;
  },
  
  deleteBlockedSite: async (id: string) => {
    const response = await api.delete(`/website-blocker/${id}`);
    return response.data;
  }
};

// Timetable API
export const timetableAPI = {
  getTimetables: async (date?: string, limit = 10) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    params.append('limit', limit.toString());
    
    const response = await api.get(`/timetable?${params}`);
    return response.data;
  },
  
  createTimetable: async (data: any) => {
    const response = await api.post('/timetable', data);
    return response.data;
  },
  
  updateTimetable: async (id: string, data: any) => {
    const response = await api.put(`/timetable/${id}`, data);
    return response.data;
  },
  
  deleteTimetable: async (id: string) => {
    const response = await api.delete(`/timetable/${id}`);
    return response.data;
  }
};

// Social API
export const socialAPI = {
  getChats: async () => {
    const response = await api.get('/social/chats');
    return response.data;
  },
  
  createChat: async (data: any) => {
    const response = await api.post('/social/chats', data);
    return response.data;
  },
  
  sendMessage: async (chatId: string, content: string) => {
    const response = await api.post(`/social/chats/${chatId}/messages`, { content });
    return response.data;
  },
  
  getFollowers: async () => {
    const response = await api.get('/social/followers');
    return response.data;
  },
  
  getFollowing: async () => {
    const response = await api.get('/social/following');
    return response.data;
  }
};

// AI API
export const aiAPI = {
  chat: async (message: string, model = 'gemini-1.5-flash') => {
    const response = await api.post('/ai/chat', { message, model });
    return response.data;
  },
  
  generateTimetable: async (prompt: string, model = 'gemini-1.5-flash') => {
    const response = await api.post('/ai/timetable', { prompt, model });
    return response.data;
  }
};

export default api;