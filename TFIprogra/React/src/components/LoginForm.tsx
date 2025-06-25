import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from '@tanstack/react-router'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()
  const { login, isPending, isError, error } = useAuth()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    login({ email, password }, {
      onSuccess: () => {
        navigate({ to: '/boards' })
      },
      onError: (err) => {
        alert((err as Error).message)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        className="border rounded p-2"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Contraseña"
        className="border rounded p-2"
        required
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-500 text-white py-2 rounded"
      >
        {isPending ? 'Ingresando...' : 'Iniciar sesión'}
      </button>

      {isError && <p className="text-red-600 text-sm">{(error as Error).message}</p>}
    </form>
  )
}
