import { useQuery } from '@tanstack/react-query'

export function useTasks(boardId: string) {
  return useQuery({
    queryKey: ['tasks', boardId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:3000/api/boards/${boardId}/tasks`, {
        credentials: 'include',
      })

      if (!res.ok) {
        const error = await res.text()
        throw new Error(error || 'Error al obtener tareas')
      }

      const data = await res.json()
      return data // debe ser un array de tareas
    },
    enabled: !!boardId, // sólo corre si hay boardId
  })
}
