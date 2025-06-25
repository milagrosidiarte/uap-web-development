import LoginForm from '../components/LoginForm'
import { Link } from '@tanstack/react-router'

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>
      <LoginForm />
      <p className="text-sm text-center mt-4">
        ¿No tenés una cuenta?{' '}
        <Link to="/register" className="text-blue-600 underline">
          Registrate
        </Link>
      </p>
    </div>
  )
}
