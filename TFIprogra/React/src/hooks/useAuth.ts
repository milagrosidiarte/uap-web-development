// src/hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query'
import { login as loginRequest, logout as logoutRequest } from '../api/auth'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const setUser = useAuthStore(state => state.setUser)
  const logoutStore = useAuthStore(state => state.logout)

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const perfil = await loginRequest(username, password)
      setUser(perfil.user)
    },
  })

  const logout = async () => {
    await logoutRequest()
    logoutStore()
  }

  return {
    login: loginMutation.mutate,
    isPending: loginMutation.isPending,
    isError: loginMutation.isError,
    error: loginMutation.error,
    logout,
  }
}
