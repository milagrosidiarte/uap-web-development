import { useBoardStore } from '../store/useBoardStore';
import { NewBoardForm } from './NewBoardForm';
import { BoardItem } from './BoardItem';
import { useBoards } from '../hooks/useBoards';
import { Link } from '@tanstack/react-router';

export function BoardsNav() {
  const activeBoardId = useBoardStore((state) => state.activeBoardId);
  const setActiveBoardId = useBoardStore((state) => state.setActiveBoardId);

  const { data } = useBoards();

  const boards = data ?? [];

  return (
    <nav className="flex gap-2 bg-white p-2 border-b-[2px] border-[#ddd] w-full">
      {boards.map((board) => (
        <Link 
          key={board.id}
          to="/boards/$boardId"
          params={{ boardId: board.id}}
          onClick={() => setActiveBoardId(board.id)}
          className={`relative px-3 py-1 rounded font-medium ${board.id === activeBoardId ? 'bg-blue-200' : 'bg-gray-200'}`}
        >
          {board.name}
          {board.id === activeBoardId && (
            <BoardItem board={board} />
          )}
        </Link>
      ))}
      <div className='flex items-center gat-4 ml-auto'>
        <NewBoardForm />
      </div>
      
    </nav>
  );
}
