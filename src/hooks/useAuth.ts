import { create } from 'zustand'

interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    avatar?: string
    verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
}

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    setUser: (user: User) => void
}

export const useAuth = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,

    login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
            // Mock login - replace with actual API call
            const mockUser: User = {
                id: '1',
                firstName: 'Sally',
                lastName: 'Brown',
                email: email,
                verificationStatus: 'VERIFIED'
            }
            set({ user: mockUser, isAuthenticated: true })
        } catch (error) {
            console.error('Login failed:', error)
        } finally {
            set({ isLoading: false })
        }
    },

    logout: () => {
        set({ user: null, isAuthenticated: false })
    },

    setUser: (user: User) => {
        set({ user, isAuthenticated: true })
    }
}))
