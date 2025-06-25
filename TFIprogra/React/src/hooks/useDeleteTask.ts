import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteTask } from '../api/tasks'

export function useDeleteTask(boardId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] })
    },
  })
}
