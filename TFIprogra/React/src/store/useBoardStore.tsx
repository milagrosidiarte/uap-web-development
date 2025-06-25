import { create } from "zustand";

export type Board = {
  id: string;
  name: string;
};

type State = {
  boards: Board[];
  setBoards: (boards: Board[]) => void;
  activeBoardId: string;
  setActiveBoardId: (id: string) => void;
};

export const useBoardStore = create<State>((set) => ({
  boards: [],
  setBoards: (boards) => set({ boards }),
  activeBoardId: "general",
  setActiveBoardId: (id) => set({ activeBoardId: id }),
}));
