import { createRouter, createRootRoute, createRoute } from "@tanstack/react-router";
import { App } from "./App";
import { Index } from "./pages";
import { Settings } from "./pages/Settings";

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

const routeTree = rootRoute.addChildren([
  indexRoute,
  boardsRoute,
  settingsRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}