import { useEffect, useState, type FormEvent } from "react";
import { BASE_URL } from "../hooks/useTasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Task } from "../types";
import { useFilterStore } from "../store/useFilterStore";
import { showToast } from "../utils/showToast";
import { useBoardStore } from "../store/useBoardStore";

type NewTaskFormProps = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  taskEditing: Task | null;
  setTaskEditing: (task: Task | null) => void;
};

export function NewTaskForm({ page, setPage, taskEditing, setTaskEditing }: NewTaskFormProps) {
  const filter = useFilterStore((state) => state.filter);
  const activeBoardId = useBoardStore((state) => state.activeBoardId);
  console.log("Active Board ID in NewTaskForm:", activeBoardId);
  const queryClient = useQueryClient();
  const queryKey = ["tasks", filter, activeBoardId, page];

  const isEditing = taskEditing !== null;

  const { mutate: addTask } = useMutation({
    mutationFn: async ({ text, activeBoardId }: {text: string; activeBoardId: string}) => {
      const response = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, activeBoardId }),
      });

      const data: Task = await response.json();
      return data;
    },
    onSuccess: () => {
      showToast("Task added successfully", "success");
      console.log("queryKey antes del invalidate", queryKey);
      queryClient.invalidateQueries({ queryKey });
      setTaskEditing(null);
    },
    onError: (error) => {
      showToast(`Error adding task: ${error}`, "error");
    },
  });

  const { mutate: editTask } = useMutation({
    mutationFn: async ({ id, text }: { id: string; text: string }) => {
      const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, text }),
      });

      const data: Task = await response.json();
      return data;
    },
    onSuccess: () => {
      showToast("Task updated successfully", "success");
      queryClient.invalidateQueries({ queryKey });
      setTaskEditing(null);
    },
    onError: (error) => {
      showToast(`Error updating task: ${error}`, "error");
    },
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const target = event.target as HTMLFormElement;
    const formData = new FormData(target);
    const text = formData.get("task")?.toString();

    if (!text) {
      return alert("Please enter a task");
    }

    if (isEditing && taskEditing) {
      editTask({ id: taskEditing.id, text });
    } else {
      console.log("Adding task to board:", activeBoardId);
      addTask({ text, activeBoardId });
    }
    setInputValue(""); // Clear input after submission
  }

  const [inputValue, setInputValue] = useState(taskEditing?.text ?? "");

  useEffect(() => {
    setInputValue(taskEditing?.text ?? "");
  }, [taskEditing]);

  return (
    <form method="POST" action="/api/agregar" className="flex justify-center items-center my-5 mx-auto max-w-xl" id="task-input" onSubmit={handleSubmit}>
      <input type="text" className="w-[60%] py-2 px-2 rounded-[20px] bg-[#eadecf] border-none placeholder:text-[13px] placeholder:text-[#888]" name="task" placeholder="What do you need to do?" required
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="submit" className="bg-[#65b8d8] text-white py-2 px-5 ml-2 rounded-[20px] cursor-pointer hover:bg-[#4a9cbd]" name="add-task">{isEditing ? "SAVE" : "ADD"}</button>
      {isEditing && (
        <button type="button"className="ml-2 py-2 px-5 rounded-[20px] bg-gray-300 hover:bg-gray-400 cursor-pointer"
          onClick={() => setTaskEditing(null)}
        >
          Cancel
        </button>
      )}
    </form>
  );
};