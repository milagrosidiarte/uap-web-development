import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBoard } from '../api/boards'

export function useCreateBoard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (name: string) => {
      return await createBoard(name)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] }) // 🔁 actualiza la lista
    },
  })
}
// Esta función se usa para crear un nuevo tablero y actualizar la lista de tableros en caché.
// Se usa en el formulario de creación de tableros en BoardsPage.