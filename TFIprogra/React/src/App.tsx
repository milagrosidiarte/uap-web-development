import { Outlet } from '@tanstack/react-router'

export default function App() {

  return (
  <div className="min-h-screen bg-white text-black">
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
