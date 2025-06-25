import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { register } from '../api/auth'

export default function RegisterForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await register(username, password)
      navigate({ to: '/login' })
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message)
        } else {
            setError('Error desconocido')
        }
    }

  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Nombre de usuario"
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
      <button type="submit" className="bg-green-600 text-white py-2 rounded">
        Registrarse
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  )
}
