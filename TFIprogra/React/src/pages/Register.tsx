import { RegisterForm } from '../components/RegisterForm'
import { Link } from '@tanstack/react-router'

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Registrarse</h2>
      
      <RegisterForm />

      <p className="text-sm text-center mt-4">
        ¿Ya tenés una cuenta?{' '}
        <Link to="/login" className="text-blue-600 underline">
          Iniciar sesión
        </Link>
      </p>
    </div>
  )
}
