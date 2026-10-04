import { createRootRoute, Outlet } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
export const Route = createRootRoute({
  component: () => (
    <NuqsAdapter>
      <Outlet />
    </NuqsAdapter>
  ),
  notFoundComponent: () => (
    <main className="p-8">
      <h1>Page not found</h1>
      <a href="/">Return to Noola</a>
    </main>
  ),
});
