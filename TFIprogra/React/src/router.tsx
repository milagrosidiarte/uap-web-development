import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import App from './App'
import LoginPage from './pages/Login'
import HomePage from './pages/Home'
import RegisterPage from './pages/Register'
import BoardsPage from './pages/Boards'
import BoardView from './pages/BoardView'
const rootRoute = createRootRoute({
  component: App,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
})

const boardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/boards',
  component: BoardsPage,
})

const boardViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/boards/$boardId',
  component: BoardView,
})

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute, 
  boardsRoute,
  boardViewRoute
  // Aquí es donde defines la ruta de registro
  // agregarás register y otras rutas luego
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
