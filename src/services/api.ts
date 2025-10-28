import axios from 'axios';
import toast from 'react-hot-toast';
import { ExploreResponse } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1010/api/v1';

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

export { api };