import { useMutation } from '@tanstack/react-query'
import { register as registerRequest } from '../api/auth'

export function useRegister() {
  return useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      await registerRequest(username, password)
    },
  })
}
