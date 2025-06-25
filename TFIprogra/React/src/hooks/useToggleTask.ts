import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleTask } from '../api/tasks'

export function useToggleTask(boardId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskId: string) => {
      return await toggleTask(taskId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] })
    },
  })
}
