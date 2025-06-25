import { useMutation } from '@tanstack/react-query'
import { login as loginRequest } from '../api/auth'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const loginToStore = useAuthStore(state => state.login)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const logout = useAuthStore(state => state.logout)
  const user = useAuthStore(state => state.user)

  const { mutate: login, isPending, isError, error } = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const token = await loginRequest(email, password)
      loginToStore(token)
    },
  })

  return {
    login,
    logout,
    user,
    isAuthenticated,
    isPending,
    isError,
    error,
  }
}
