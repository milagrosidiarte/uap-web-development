import { useEffect, useState, type FormEvent } from "react";
import { BASE_URL } from "../hooks/useTasks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Board } from "../store/useBoardStore";
import { useFilterStore } from "../store/useFilterStore";
import { showToast } from "../utils/showToast";


export function NewBoardForm() {
  const filter = useFilterStore((state) => state.filter);
  const queryClient = useQueryClient();
  const queryKey = ["boards"];

  const { mutate: addBoard } = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch(`${BASE_URL}/boards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: name }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add board: ${errorText}`);
      }

      const data: Board = await response.json();
      return data;
    },
    onSuccess: () => {
      showToast("Board added successfully", "success");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      showToast(`Error adding board: ${error}`, "error");
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const target = event.target as HTMLFormElement;
    const formData = new FormData(target);
    const name = formData.get("board")?.toString().trim();

    if (!name) {
      return alert("Please enter a board name");
    }
    
    addBoard(name);
    target.reset(); // Reset the form after submission
  };

  return (
    <form method="POST" action="/api/agregarTablero" id="board-input" onSubmit={handleSubmit}>
      <input
        type="text"
        className="w-40 border px-2 py-1 rounded mr-2 placeholder:text-[13px] placeholder:text-[#888]"
        name="board"
        placeholder="Board name"
        required
      />
      <button type="submit" className="bg-[#b07c7c] text-white text-[20px] py-1 px-4 rounded-[5px] cursor-pointer">+</button>
    </form>
  );
}
