import { create } from 'zustand'

type FilterState = {
  completed: 'all' | '1' | '0' // all = sin filtro, 1 = completadas, 0 = pendientes
  search: string
  page: number
  setCompleted: (value: 'all' | '1' | '0') => void
  setSearch: (value: string) => void
  setPage: (page: number) => void

}

export const useTaskFilterStore = create<FilterState>((set) => ({
  completed: 'all',
  search: '',
  setCompleted: (value) => set({ completed: value, page: 1 }),
  setSearch: (value) => set({ search: value, page: 1 }),
  page: 1,
  setPage: (page) => set({ page }),

}))
