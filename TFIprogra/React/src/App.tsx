import { ToastContainer } from "./components/ToastContainer"
import Navbar from "./components/Navbar"
import { BoardsNav } from "./components/BoardsNav"
import { Outlet } from "@tanstack/react-router"
import { useAuthStore } from "./store/authStore"

export function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  return (
    <>
      <ToastContainer />

      <header>
        <h1 className="font-bold text-center text-[32px] text-[#333] my-4">
          <span className="text-[#e08e36]">TO</span>DO
        </h1>
      </header>

      {isAuthenticated && (
        <>
          <Navbar />
          <BoardsNav />
        </>
      )}

      <Outlet />
    </>
  )
}

export default App
