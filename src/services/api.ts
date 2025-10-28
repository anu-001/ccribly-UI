import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
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
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        if (status === 401 || status === 403) {
            // Clear auth on unauthorized so header hides name/logout immediately
            try {
                useAuthStore.getState().clearAuth();
            } catch (_) { }
            localStorage.removeItem('authToken');
        }
        if (status === 409 && /already verified/i.test(message)) {
            toast.success('You\'re already verified');
            setTimeout(() => { window.location.href = '/profile'; }, 800);
            return Promise.reject(error);
        }
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

    getMe: async (): Promise<User> => {
        const response = await api.get('/auth/me');
        const d = response.data;
        // Normalize common wrappers
        const user = d?.data?.user || d?.data || d?.user || d;
        return user as User;
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