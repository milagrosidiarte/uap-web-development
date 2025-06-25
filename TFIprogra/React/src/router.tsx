import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import App from './App'
import LoginPage from './pages/Login'
import HomePage from './pages/Home'

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

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  // agregarás register y otras rutas luego
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
