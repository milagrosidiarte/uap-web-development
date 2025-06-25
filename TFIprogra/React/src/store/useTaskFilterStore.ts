import { create } from 'zustand'

type FilterState = {
  completed: 'all' | '1' | '0' // all = sin filtro, 1 = completadas, 0 = pendientes
  search: string
  setCompleted: (value: 'all' | '1' | '0') => void
  setSearch: (value: string) => void
}

export const useTaskFilterStore = create<FilterState>((set) => ({
  completed: 'all',
  search: '',
  setCompleted: (value) => set({ completed: value }),
  setSearch: (value) => set({ search: value }),
}))
