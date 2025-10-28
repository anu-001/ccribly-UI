import axios from 'axios';
import toast from 'react-hot-toast';
import { ExploreResponse, SignUpData, SignInData, AuthResponse, User } from '@/types';

const API_URL = 'http://localhost:1010/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Or from a more secure store
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message;
        toast.error(message);
        return Promise.reject(error);
    }
);

// API functions
export const exploreApi = {
    getExploreData: async (): Promise<ExploreResponse> => {
        const response = await api.get('/explore');
        return response.data;
    },
};

export const authApi = {
    signUp: async (data: SignUpData): Promise<AuthResponse> => {
        const response = await api.post('/auth/signup', data);
        return response.data;
    },

    signIn: async (data: SignInData): Promise<AuthResponse> => {
        const response = await api.post('/auth/signin', data);
        return response.data;
    },

    getMe: async (): Promise<{ data: User }> => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    refreshToken: async (): Promise<{ data: { accessToken: string } }> => {
        const response = await api.post('/auth/refresh');
        return response.data;
    },

    logout: async (): Promise<void> => {
        await api.post('/auth/logout');
    },
};

export { api };