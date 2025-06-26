import { useEffect, useState } from 'react'
import { useParams } from '@tanstack/react-router'

type UsuarioCompartido = {
username: string
role: 'owner' | 'editor' | 'viewer'
}

export default function UsuariosCompartidos() {
  const { boardId } = useParams({ strict: false }) as { boardId: string }
  const [usuarios, setUsuarios] = useState<UsuarioCompartido[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
	const fetchUsuarios = async () => {
	  try {
		const res = await fetch(`http://localhost:3000/api/boards/${boardId}/users`, {
		  credentials: 'include',
		})
		const data = await res.json()
		if (!res.ok) throw new Error(data.error || 'Error al cargar usuarios')
		setUsuarios(data)
	  } catch (err) {
		setError((err as Error).message)
	  }
	}

	fetchUsuarios()
  }, [boardId])

  return (
	<div className="mt-8">
	  <h3 className="text-lg font-semibold mb-2">Usuarios con acceso</h3>
	  {error && <p className="text-red-600">{error}</p>}
	  {usuarios.length === 0 ? (
		<p>No hay usuarios compartidos.</p>
	  ) : (
		<ul className="space-y-1">
		  {usuarios.map((u) => (
			<li key={u.username} className="border rounded p-2 flex justify-between items-center">
			  <span className="font-medium">{u.username}</span>
			  <span className="text-sm text-gray-600">{u.role}</span>
			</li>
		  ))}
		</ul>
	  )}
	</div>
  )
}
