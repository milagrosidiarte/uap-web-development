import { createRouter, createRootRoute, createRoute } from "@tanstack/react-router";
import { App } from "./App";
import { Index } from "./pages";
import { Settings } from "./pages/Settings";
import BoardsHome from './pages/BoardsHome'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
const rootRoute = createRootRoute({
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  component: Index,
  path: "/",
});

const boardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/boards/$boardId",
  component: Index,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: Settings,
});

const boardsRootRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/boards",
  component: BoardsHome, // crea este componente
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  boardsRoute,
  boardsRootRoute,
  settingsRoute,
  loginRoute,
  registerRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}