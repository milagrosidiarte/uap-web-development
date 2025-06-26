import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ConfigState = {
 limit: number
 uppercase: boolean
 autoRefetchInterval: number
 setLimit: (value: number) => void
 setUppercase: (value: boolean) => void
 setAutoRefetchInterval: (value: number) => void
}

export const useConfigStore = create<ConfigState>()(
 persist(
   (set) => ({
     limit: 5,
      uppercase: false,
      autoRefetchInterval: 30000,
      setLimit: (value) => set({ limit: value }),
      setUppercase: (value) => set({ uppercase: value }),
      setAutoRefetchInterval: (value) => set({ autoRefetchInterval: value }),
    }),
    {
      name: 'config-storage',
    }
  )
)
