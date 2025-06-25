import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { useCreateTask } from '../hooks/useCreateTask'

export default function NewTaskForm() {
  const { boardId } = useParams({ strict: false }) as { boardId: string }
  const [content, setContent] = useState('')
  const { mutate, isError, error } = useCreateTask(boardId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    mutate(content)
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Nueva tarea"
        className="border p-2 rounded w-full"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Agregar
      </button>
      {isError && <p className="text-red-600 text-sm">{(error as Error).message}</p>}
    </form>
  )
}
