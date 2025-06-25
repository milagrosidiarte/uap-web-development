import { useAuthStore } from '../store/authStore'
import { useNavigate, Link } from '@tanstack/react-router'

export default function Navbar() {
  const user = useAuthStore(state => state.user)
  const logout = useAuthStore(state => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  if (!user) return null // no mostrar si no hay usuario

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/boards" className="text-blue-600 font-semibold">Mis tableros</Link>
        <Link to="/settings" className="text-blue-600 font-semibold">Configuración</Link>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-gray-700 text-sm">
          Sesión: <strong>{user.name || user.email}</strong>
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}
