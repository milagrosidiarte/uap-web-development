import { create } from 'zustand'

type Task = { id: string; content: string }

type TaskEditState = {
  tareaEditando: Task | null
  setTareaEditando: (task: Task | null) => void
}

export const useTaskEditStore = create<TaskEditState>((set) => ({
  tareaEditando: null,
  setTareaEditando: (task) => set({ tareaEditando: task }),
}))
