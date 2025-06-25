import { useParams } from '@tanstack/react-router'
import { useTasks } from '../hooks/useTasks'
import NewTaskForm from '../components/NewTaskForm'

export default function BoardView() {
  const { boardId } = useParams({ strict: false }) as { boardId: string }
  const { data, isLoading, isError, error } = useTasks(boardId)

  if (isLoading) return <p className="p-4">Cargando tareas...</p>
  if (isError) return <p className="p-4 text-red-600">Error: {(error as Error).message}</p>

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Tareas de {boardId}</h2>
      <ul className="space-y-2">
        {data.map((task: { id: string; content: string; completed: boolean }) => (
          <li key={task.id} className="border p-2 rounded bg-white shadow">
            {task.completed ? '✅' : '⬜️'} {task.content}
          </li>
        ))}
        <NewTaskForm />
      </ul>
    </div>
  )
}
