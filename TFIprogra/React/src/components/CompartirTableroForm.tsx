import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { toast } from 'react-hot-toast'

export default function CompartirTableroForm() {
  const { boardId } = useParams({ strict: false }) as { boardId: string }
  const [username, setUsername] = useState('')
  const [role, setRole] = useState<'editor' | 'viewer'>('viewer')

  const handleSubmit = async (e: React.FormEvent) => {
	e.preventDefault()

	try {
	  const res = await fetch(`http://localhost:3000/api/boards/${boardId}/share`, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify({ username, role }),
	  })

	  const data = await res.json()

	  if (!res.ok) {
		throw new Error(data.error || 'Error al compartir el tablero')
	  }

	  toast.success(`Tablero compartido con ${username} como ${role}`)
	  setUsername('')
	  setRole('viewer')
	} catch (err) {
	  toast.error((err as Error).message)
	}
  }

  return (
	<form onSubmit={handleSubmit} className="mt-6 space-y-4 max-w-md">
	  <h3 className="text-lg font-semibold">Compartir tablero</h3>

	  <div>
		<label className="block font-medium mb-1">Nombre de usuario</label>
		<input
		  type="text"
		  value={username}
		  onChange={(e) => setUsername(e.target.value)}
		  required
		  className="border p-2 rounded w-full"
		/>
	  </div>

	  <div>
		<label className="block font-medium mb-1">Rol</label>
		<select
		  value={role}
		  onChange={(e) => setRole(e.target.value as 'editor' | 'viewer')}
		  className="border p-2 rounded w-full"
		>
		  <option value="viewer">Lector (solo lectura)</option>
		  <option value="editor">Editor (puede modificar tareas)</option>
		</select>
	  </div>

	  <button
		type="submit"
		className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
	  >
		Compartir
	  </button>
	</form>
  )
}
