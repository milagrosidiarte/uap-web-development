import { useMutation } from '@tanstack/react-query'
import { register as registerRequest } from '../api/auth'
import { useAuthStore } from '../store/authStore'

export function useRegister() {
  const loginToStore = useAuthStore(state => state.login)

  const mutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const token = await registerRequest(email, password)
      loginToStore(token)
    },
  })

  return mutation
}
