import { useBoards } from '../hooks/useBoards'
import NewBoardForm from '../components/NewBoardForm'
import { Link } from '@tanstack/react-router'

export default function BoardsPage() {
  const { data, isLoading, isError, error } = useBoards()

  if (isLoading) return <p className="p-4">Cargando tableros...</p>
  if (isError) return <p className="p-4 text-red-600">Error: {(error as Error).message}</p>

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Tus tableros</h2>
      <ul className="flex flex-col gap-2">
        {data.map((board: { id: string; name: string }) => (
          <li key={board.id}>
            <Link
              to="/boards/$boardId"
              params={{ boardId: board.id }}
              className="block p-2 border rounded bg-white shadow hover:bg-gray-100"
            >
              {board.name}
            </Link>
          </li>
        ))}
      </ul>
      <NewBoardForm />
    </div>
  )
}
