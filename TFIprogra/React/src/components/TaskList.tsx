import type { Task } from '../types';
import { TaskItem } from './TaskItem.tsx';
import { useTasks } from '../hooks/useTasks.tsx';

type TaskItemProps = {
  page: number;
  setPage: (page: number) => void;
  setTaskEditing: (task: Task | null) => void;
};

export function TaskList({ page, setPage, setTaskEditing }: TaskItemProps) {
  const limit = 5;

  const { data, isLoading, isError } = useTasks( page, limit);

  if (isLoading) return (
    <div className="flex justify-center items-center h-full">
      <p className="text-center text-[20px]">Loading...</p>
    </div>
  );
  if (isError) return (
    <div className="flex justify-center items-center h-full">
      <p className="text-center text-[20px]">Error loading tasks</p>
    </div>
  );

  const tasks = data?.tasks ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  
  return (
    <div>
      <ul className="list-none mx-auto max-w-xl bg-[#e4dfd9] rounded-[10px] p-[20px]" id="task-list">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} setTaskEditing={setTaskEditing} />
        ))}
      </ul>

      <div className="mx-auto max-w-xl flex justify-between mt-4">
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 disabled:cursor-auto cursor-pointer"
        >
          Previous
        </button>
        
        <div className="absolute left-1/2 -translate-x-1/2 text-center text-gray-700 mt-1">
          <span className="text-lg">
            Page {page} of {totalPages}
          </span>
        </div>

        <button
          onClick={() => setPage(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50 disabled:cursor-auto cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}