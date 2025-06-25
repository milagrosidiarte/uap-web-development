import { useState } from 'react'
import { useRegister } from '../hooks/useRegister'
import { useNavigate } from '@tanstack/react-router'

export function RegisterForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const { mutate: register, isPending, isError, error, isSuccess } = useRegister()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    register(
      { username, password },
      {
        onSuccess: () => navigate({ to: '/login' }),
        onError: (err) => alert((err as Error).message),
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
      <input
        type="text"
        name="username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Nombre de usuario"
        className="border p-2 rounded"
        required
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Contraseña"
        className="border p-2 rounded"
        required
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-green-600 text-white rounded p-2"
      >
        {isPending ? 'Registrando...' : 'Registrarse'}
      </button>

      {isError && <p className="text-red-600 text-sm">{(error as Error).message}</p>}
      {isSuccess && <p className="text-green-600 text-sm">¡Registrado correctamente!</p>}
    </form>
  )
}
