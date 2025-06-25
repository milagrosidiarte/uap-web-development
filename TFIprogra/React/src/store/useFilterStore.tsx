import { create } from "zustand";
import type { TaskFilter } from "../hooks/useTasks";

type FilterState = {
    filter: TaskFilter;
    setFilter: (filter: TaskFilter) => void;
};

export const useFilterStore = create<FilterState>((set) => ({
    filter: "all", // Default filter
    setFilter: (filter) => set({ filter }),
}));