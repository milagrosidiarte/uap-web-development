import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../hooks/useTasks";
import type { Task } from "../types";
import { useFilterStore } from "../store/useFilterStore";
import { useBoardStore } from "../store/useBoardStore";

export function ClearCompleted() {
  const filter = useFilterStore((state) => state.filter);
  const activeBoardId = useBoardStore((state) => state.activeBoardId)
  const queryClient = useQueryClient();
  const queryKey = ["tasks", filter, activeBoardId];
  
  const { mutate: clearCompleted } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${BASE_URL}/tasks/clear-completed`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activeBoardId })
      });
      const data: Task[] = await response.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <form method="POST" className="clear-completed-form" name="clear-completed-form" action="/api/clear-completed">
      <button type="submit" className="bg-[#d9534f] text-white py-2 px-5 rounded-[5px] mt-2 block mx-auto cursor-pointer hover:bg-[#c9302c]" name="clear-completed" onClick={(e) => {
        e.preventDefault();
        clearCompleted();
      }}>Clear Completed</button>
    </form>
  );
}