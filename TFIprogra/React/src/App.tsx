import { Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useConfigStore } from './store/configStore'

export default function App() {
  const darkMode = useConfigStore((s) => s.darkMode)
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <header className="text-center p-4 border-b">
        <h1 className="text-3xl font-bold">
          <span className="text-blue-600">TO</span>DO App
        </h1>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}
