import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'

interface User {
  id: string
  email: string
  name?: string
  role?: string
}

interface AuthState {
  token: string | null
  user: User | null
  login: (token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),

  login: (token: string) => {
    const decoded = jwtDecode<User>(token)
    localStorage.setItem('token', token)
    set({ token, user: decoded, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null, isAuthenticated: false })
  },
}))
