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
const router = makeRouter();
function RouterScope() {
  const [scopedRouter] = React.useState(makeRouter);
  return <RouterProvider router={scopedRouter} />;
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
    <SessionScope>{(epoch) => <RouterScope key={epoch} />}</SessionScope>
  </React.StrictMode>,
);
