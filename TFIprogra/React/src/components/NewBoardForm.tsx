import { useState } from 'react'
import { useCreateBoard } from '../hooks/useCreateBoard'

export default function NewBoardForm() {
  const [name, setName] = useState('')
  const { mutate, isError, error } = useCreateBoard()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    mutate(name)
    setName('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-4">
      <input
        type="text"
        placeholder="Nuevo tablero"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Crear
      </button>
      {isError && <p className="text-red-600 text-sm">{(error as Error).message}</p>}
    </form>
  )
}
