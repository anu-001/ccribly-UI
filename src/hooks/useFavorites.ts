import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
    favorites: string[]
    addFavorite: (propertyId: string) => void
    removeFavorite: (propertyId: string) => void
    toggleFavorite: (propertyId: string) => void
    isFavorite: (propertyId: string) => boolean
}

export const useFavorites = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: [],

            addFavorite: (propertyId: string) => {
                set((state) => ({
                    favorites: [...state.favorites, propertyId]
                }))
            },

            removeFavorite: (propertyId: string) => {
                set((state) => ({
                    favorites: state.favorites.filter(id => id !== propertyId)
                }))
            },

            toggleFavorite: (propertyId: string) => {
                const { favorites, addFavorite, removeFavorite } = get()
                if (favorites.includes(propertyId)) {
                    removeFavorite(propertyId)
                } else {
                    addFavorite(propertyId)
                }
            },

            isFavorite: (propertyId: string) => {
                return get().favorites.includes(propertyId)
            }
        }),
        {
            name: 'favorites-storage',
        }
    )
)
