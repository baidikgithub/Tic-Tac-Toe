import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  signin: (credentials) => API.post('/auth/signin', credentials),
  signup: (userData) => API.post('/auth/signup', userData),
  getMe: () => API.get('/auth/me'),
};

// Game API functions
export const gameAPI = {
  saveGame: (gameData) => API.post('/games', gameData),
  getGames: (params = {}) => API.get('/games', { params }),
  getStats: () => API.get('/games/stats'),
  deleteGame: (gameId) => API.delete(`/games/${gameId}`),
};

// Health check
export const healthCheck = () => API.get('/health');

export default API; 