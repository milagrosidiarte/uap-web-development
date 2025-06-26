import { useEffect, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { useCreateTask } from '../hooks/useCreateTask'
import { useQueryClient } from '@tanstack/react-query'
import { editTask } from '../api/tasks'
import { useTaskEditStore } from '../store/useTaskEditStore'

export default function NewTaskForm() {
  const { boardId } = useParams({ strict: false }) as { boardId: string }
  const { tareaEditando, setTareaEditando } = useTaskEditStore()
  const [content, setContent] = useState('')
  const { mutate, isError, error } = useCreateTask(boardId)
  const queryClient = useQueryClient()

  useEffect(() => {
	if (tareaEditando) {
	  setContent(tareaEditando.content)
	} else {
	  setContent('')
	}
  }, [tareaEditando])

  const handleSubmit = (e: React.FormEvent) => {
	e.preventDefault()
	if (!content.trim()) return

	if (tareaEditando) {
	  editTask(tareaEditando.id, content).then(() => {
		setTareaEditando(null)
		queryClient.invalidateQueries({ queryKey: ['tasks', boardId] })
		setContent('')
	  })
	} else {
	  mutate(content)
	  setContent('')
	}
  }

  return (
	<form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4">
	  <input
		type="text"
		value={content}
		onChange={(e) => setContent(e.target.value)}
		placeholder={tareaEditando ? 'Editar tarea...' : 'Nueva tarea'}
		className="border p-2 rounded w-full"
	  />
	  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
		{tareaEditando ? 'Guardar' : 'Agregar'}
	  </button>
	  {tareaEditando && (
		<button
		  type="button"
		  onClick={() => {
			setTareaEditando(null)
			setContent('')
		  }}
		  className="bg-gray-300 px-4 py-2 rounded"
		>
		  Cancelar
		</button>
	  )}
	  {isError && <p className="text-red-600 text-sm">{(error as Error).message}</p>}
	</form>
  )
}
