import type { Board } from "../store/useBoardStore";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./useTasks";
import { useAuth } from "./useAuth";


export function useBoards() {
  const queryKey = ["boards"];

  return useQuery<Board[]>({
    queryKey,
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/boards`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch boards: ${errorText}`);
      }

      const data: Board[] = await response.json();
      return data;
    },
    // initialData: [],
    staleTime: 0,
  });
}