import { createRouter, RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { SessionScope } from "./features/account/session-scope";
import { routeTree } from "./routeTree.gen";
import "./styles/globals.css";

function makeRouter() {
  return createRouter({
    routeTree,
    defaultPreload: false,
    defaultPreloadStaleTime: 0,
  });
}
let router = makeRouter();
function resetRouteScope() {
  router = makeRouter();
}
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
const root = document.getElementById("root");
if (!root) throw new Error("Missing root element");
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <SessionScope resetRouteScope={resetRouteScope}>
      {(epoch) => <RouterProvider key={epoch} router={router} />}
    </SessionScope>
  </React.StrictMode>,
);
