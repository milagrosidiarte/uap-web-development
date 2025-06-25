import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Task } from '../types';
import { BASE_URL } from '../hooks/useTasks';
import { useFilterStore } from '../store/useFilterStore';
import { showToast } from '../utils/showToast';
import { useBoardStore } from '../store/useBoardStore';
import { useSettingsStore } from '../store/useSettingsStore';

type TaskItemProps = {
	task: Task;
  // boardId: string;
  setTaskEditing: (task: Task | null) => void;
};

export function TaskItem({ task, setTaskEditing }: TaskItemProps) {
  const filter = useFilterStore((state) => state.filter);
  const boardId = useBoardStore((state) => state.activeBoardId);
	const queryClient = useQueryClient();
	const queryKey = ['tasks', filter, boardId];

  const uppercase = useSettingsStore((state) => state.uppercaseDescriptions);

	const { mutate: toggleTask } = useMutation({
		mutationFn: async (id: string) => {
			const response = await fetch(`${BASE_URL}/tasks/${id}/toggle`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id, boardId }),
			});

      const data: Task = await response.json();
      return data;
		},
		onMutate: (id) => { //si no funciona ver como esta en app.tsx
      queryClient.setQueryData(queryKey, (oldData: Task[]) => {
        return oldData.map((task) =>
          task.id === id ? { ...task, done: !task.done } : task
        );
      });
		},
    onError: (_, id) => {
      queryClient.setQueryData(queryKey, (oldData: Task[]) => {
        if (!oldData) return [];
        return oldData.map((task) =>
          task.id === id ? { ...task, done: !task.done } : task
        );
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    }
	});

  const { mutate: deleteTask } = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const data: Task = await response.json();
      return data;
    },
    onMutate: (id) => {
      queryClient.setQueryData(queryKey, (oldData: Task[]) => {
        if (!oldData) return [];
        return oldData.filter((task) => task.id !== id);
      });
    },
    onError: (_, id) => {
      queryClient.invalidateQueries({ queryKey });
    },
    onSuccess: () => {
      showToast('Task deleted successfully', 'success');
      queryClient.invalidateQueries({ queryKey });
    },
  })

  return (
		<li className="flex justify-between items-center border-b-[1px] p-[10px] border-[#ccc] px-4">
			<form method="POST" className="flex jusitify-between items-center w-[100%]" name="task-form" action="/api/completar">
				<div className="flex items-center g-[10px]">
					<label>
						<input type="hidden" name="task-id" value={task.id} />
						<button type="submit" className="text-[18px] cursor-pointer" name="task-btn" onClick={(e) => {
							e.preventDefault()
							toggleTask(task.id);
						}}>{task.done ? "✅" : "⬜"}</button>
						<span>{uppercase ? task.text.toUpperCase() : task.text }</span>
					</label>
				</div>
			</form>
      <div>
        <button className="text-[18px] cursor-pointer"
            onClick={() => setTaskEditing(task)}
        >
          ✏️
        </button>
      </div>
			<form method="POST" className="delete-form" name="delete-form" action="/api/eliminar/">
				<input type="hidden" name="task-id" value={task.id} />
				<button type="submit" className="text-[18px] cursor-pointer" name="delete-btn" onClick={(e) => {
					e.preventDefault()
					deleteTask(task.id);
				}}>🗑️</button>
			</form>
		</li>
  );
}