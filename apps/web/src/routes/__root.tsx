import { createRootRoute, Outlet } from "@tanstack/react-router";
export const Route = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: () => (
    <main className="p-8">
      <h1>Page not found</h1>
      <a href="/">Return to Noola</a>
    </main>
  ),
});
