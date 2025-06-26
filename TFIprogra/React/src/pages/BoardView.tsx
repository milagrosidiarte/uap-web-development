import { useParams } from '@tanstack/react-router'
import { useTasks } from '../hooks/useTasks'
import { useToggleTask } from '../hooks/useToggleTask'
import { useDeleteTask } from '../hooks/useDeleteTask'
import { useDeleteCompletedTasks } from '../hooks/useDeleteCompletedTasks'
import { useTaskFilterStore } from '../store/useTaskFilterStore'
import NewTaskForm from '../components/NewTaskForm'
import { useConfigStore } from '../store/configStore'
import { Link } from '@tanstack/react-router'
import CompartirTableroForm from '../components/CompartirTableroForm'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'react-hot-toast'
import { useTaskEditStore } from '../store/useTaskEditStore'


export default function BoardView() {
  const { boardId } = useParams({ strict: false }) as { boardId: string }
  const { data, isLoading, isError, error } = useTasks(boardId)
  const tasks = data?.tasks ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / 5)
  const { uppercase } = useConfigStore()
  const toggle = useToggleTask(boardId)
  const remove = useDeleteTask(boardId)
  const deleteCompleted = useDeleteCompletedTasks(boardId)

  const {
    completed,
    search,
    page,
    setCompleted,
    setSearch,
    setPage,
  } = useTaskFilterStore()

  const navigate = useNavigate()

const handleEliminarTablero = async () => {
  if (!confirm('¿Estás seguro de que querés eliminar este tablero? Esta acción no se puede deshacer.')) return

  try {
    const res = await fetch(`http://localhost:3000/api/boards/${boardId}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Error al eliminar tablero')

    toast.success('Tablero eliminado correctamente')
    navigate({ to: '/boards' })
  } catch (err) {
    toast.error((err as Error).message)
  }
}


  if (isLoading) return <p className="p-4">Cargando tareas...</p>
  if (isError) return <p className="p-4 text-red-600">Error: {(error as Error).message}</p>

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Tareas de {boardId}</h2>

      {/* Filtros y búsqueda */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setCompleted('all')}
            className={`px-2 py-1 rounded ${completed === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Todas
          </button>
          <button
            onClick={() => setCompleted('0')}
            className={`px-2 py-1 rounded ${completed === '0' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setCompleted('1')}
            className={`px-2 py-1 rounded ${completed === '1' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Completadas
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar tareas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded w-full max-w-xs"
        />
      </div>

      {/* Lista de tareas */}
      <ul className="space-y-2">
        {tasks.map((task: { id: string; content: string; completed: boolean }) => (
          <li key={task.id} className="border p-2 rounded bg-white shadow flex justify-between items-center">
            <span className="flex items-center gap-2">
              <button
                onClick={() => toggle.mutate(task.id)}
                className="text-lg"
                title="Cambiar estado"
              >
                {task.completed ? '✅' : '⬜️'}
              </button>
              {uppercase ? task.content.toUpperCase() : task.content}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => useTaskEditStore.getState().setTareaEditando(task)}
                className="text-blue-600 text-lg"
                title="Editar tarea"
              >
                🖉
              </button>
              <button
                onClick={() => remove.mutate(task.id)}
                className="text-red-600 font-bold text-lg"
                title="Eliminar tarea"
              >
                🗑
              </button>
            </div>
          </li>
        ))}
        </ul>

      <NewTaskForm />

      {/* Eliminar completadas */}
      <button
        onClick={() => {
          if (confirm('¿Eliminar todas las tareas completadas?')) {
            deleteCompleted.mutate()
          }
        }}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        🗑 Eliminar tareas completadas
      </button>

      {/* Paginación */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          ⬅ Anterior
        </button>
        <span>Página {page}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente ➡
        </button>
      </div>

      {/* Enlace a configuración */}
      <div className="mt-8 text-center">
        <Link to="/settings" className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          ⚙ Configuración
        </Link>
      </div>

      {/* Compartir tablero */}
      <CompartirTableroForm />

      {/* Eliminar tablero */}
      <div className="mt-6 text-center">
        <button
          onClick={handleEliminarTablero}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          🗑 Eliminar tablero
        </button>
      </div>

    </div>
  )
}
