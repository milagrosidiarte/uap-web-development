import { useQuery } from '@tanstack/react-query'
import { useTaskFilterStore } from '../store/useTaskFilterStore'

export function useTasks(boardId: string) {
  const { completed, search } = useTaskFilterStore()

  return useQuery({
    queryKey: ['tasks', boardId, completed, search],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (completed !== 'all') params.append('completed', completed)
      if (search.trim()) params.append('q', search)

      const res = await fetch(`http://localhost:3000/api/boards/${boardId}/tasks?${params.toString()}`, {
        credentials: 'include',
      })

      if (!res.ok) {
        const error = await res.text()
        throw new Error(error || 'Error al obtener tareas')
      }

      return await res.json()
    },
    enabled: !!boardId,
  })
}
