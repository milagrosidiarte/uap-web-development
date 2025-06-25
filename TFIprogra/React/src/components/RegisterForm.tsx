import { useState } from 'react'
import { useRegister } from '../hooks/useRegister'
import { useNavigate } from '@tanstack/react-router'

export function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const { mutate: register, isPending, isError, error, isSuccess } = useRegister()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    register(
      { email, password },
      {
        onSuccess: () => {
          navigate({ to: '/boards' })
        },
        onError: (err) => {
          alert((err as Error).message)
        }
      }
    )
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
        className="bg-green-600 text-white py-2 rounded"
      >
        {isPending ? 'Registrando...' : 'Registrarse'}
      </button>

      {isError && <p className="text-red-600 text-sm">{(error as Error).message}</p>}
      {isSuccess && <p className="text-green-600 text-sm">¡Usuario registrado correctamente!</p>}
    </form>
  )
}
