import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCompletedTasks } from '../api/tasks'

export function useDeleteCompletedTasks(boardId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => deleteCompletedTasks(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', boardId] })
    },
  })
}
