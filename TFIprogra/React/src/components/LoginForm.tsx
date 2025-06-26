import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'react-hot-toast'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login, isPending, isError, error } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
	e.preventDefault()
	login(
	  { username, password },
	  {
		onSuccess: () => {
		  toast.success('Sesión iniciada correctamente')
		  navigate({ to: '/boards' })
		},
		onError: (err) => {
		  toast.error((err as Error).message)
		},
	  }
	)
  }

  return (
	<form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 max-w-md mx-auto">
	  <input
		type="text"
		placeholder="Usuario"
		value={username}
		onChange={e => setUsername(e.target.value)}
		className="border p-2 rounded"
		required
	  />
	  <input
		type="password"
		placeholder="Contraseña"
		value={password}
		onChange={e => setPassword(e.target.value)}
		className="border p-2 rounded"
		required
	  />
	  <button
		type="submit"
		disabled={isPending}
		className="bg-blue-600 text-white py-2 rounded"
	  >
		{isPending ? 'Ingresando...' : 'Iniciar sesión'}
	  </button>
	  {isError && <p className="text-red-600">{(error as Error).message}</p>}
	</form>
  )
}
