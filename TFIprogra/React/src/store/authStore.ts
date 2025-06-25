// src/store/authStore.ts
import { create } from 'zustand'

interface User {
  id: number
  username: string
}

interface AuthState {
  user: User | null
  setUser: (user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user, isAuthenticated: true }),
  logout: () => {
    set({ user: null, isAuthenticated: false })
  },
  isAuthenticated: false,
}))
