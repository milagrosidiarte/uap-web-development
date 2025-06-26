import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ConfigState = {
 limit: number
 uppercase: boolean
 autoRefetchInterval: number
 darkMode: boolean
 setLimit: (value: number) => void
 setUppercase: (value: boolean) => void
 setAutoRefetchInterval: (value: number) => void
 setDarkMode: (value: boolean) => void
}

export const useConfigStore = create<ConfigState>()(
 persist(
   (set) => ({
     limit: 5,
      uppercase: false,
      autoRefetchInterval: 30000,
      darkMode: false,
      setLimit: (value) => set({ limit: value }),
      setUppercase: (value) => set({ uppercase: value }),
      setAutoRefetchInterval: (value) => set({ autoRefetchInterval: value }),
      setDarkMode: (value) => set({ darkMode: value }),
    }),
    {
      name: 'config-storage',
    }
  )
)
