import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask } from '../api/tasks'

export function useCreateTask(boardId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (content: string) => {
      return await createTask(boardId, content)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] })
    },
  })
}
