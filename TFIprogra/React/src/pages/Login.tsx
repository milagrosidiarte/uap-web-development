import LoginForm from '../components/LoginForm'
import { Link } from '@tanstack/react-router'

export default function LoginPage() {
  return (
    <div className="mt-10 p-4">
      <h2 className="text-2xl font-bold text-center mb-4">Iniciar sesión</h2>
      <LoginForm />
      <p className="text-center text-sm mt-4">
        ¿No tenés cuenta?{' '}
        <Link to="/register" className="text-blue-600 underline">Registrate</Link>
      </p>
    </div>
  )
}
