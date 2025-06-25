import type { Task } from "../types";
import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "../store/useFilterStore";
import { useBoardStore } from "../store/useBoardStore";
import { useSettingsStore } from "../store/useSettingsStore";

export type TaskFilter = "all" | "completed" | "incomplete";
export const BASE_URL = "http://localhost:3000/api";

type UseTasksResult = {
  tasks: Task[];
  total: number;
}

export function useTasks( page: number, limit = 5) {
  const filter = useFilterStore((state) => state.filter);
  const activeBoardId = useBoardStore((state) => state.activeBoardId);
  const queryKey = ["tasks", filter, activeBoardId, page];

  const { refetchInterval } = useSettingsStore();

  return useQuery<UseTasksResult>({
    queryKey,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate a delay
      const response = await fetch(`${BASE_URL}/filter?activeBoardId=${activeBoardId}&filter=${filter}&page=${page}&limit=${limit}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: UseTasksResult = await response.json();
      return data;
    },
    staleTime: 0,
    refetchInterval,
  });
}