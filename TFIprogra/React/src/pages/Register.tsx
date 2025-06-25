import RegisterForm from '../components/RegisterForm'
import { Link } from '@tanstack/react-router'

export default function RegisterPage() {
  return (
    <div className="mt-10 p-4">
      <h2 className="text-2xl font-bold text-center mb-4">Registrarse</h2>
      <RegisterForm />
      <p className="text-center text-sm mt-4">
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className="text-blue-600 underline">Iniciar sesión</Link>
      </p>
    </div>
  )
}
