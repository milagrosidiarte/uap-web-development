import { useQuery } from '@tanstack/react-query'
import { useTaskFilterStore } from '../store/useTaskFilterStore'

export function useTasks(boardId: string) {
  const { completed, search, page } = useTaskFilterStore()
  
  return useQuery({
    queryKey: ['tasks', boardId, completed, search, page],
    queryFn: async () => {
      const params = new URLSearchParams()

      if (completed !== 'all') params.append('completed', completed)
      if (search.trim()) params.append('q', search)

      const limit = 5
      const offset = (page - 1) * limit
      params.append('limit', limit.toString())
      params.append('offset', offset.toString())

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
