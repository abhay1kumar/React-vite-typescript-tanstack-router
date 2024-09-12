import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import React from "react";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      );

interface MyRouterContext {
  queryCLient: QueryClient;
}

const Root = () => (
  <>
    <div
      style={{
        display: "flex",
        gap: "20px",
      }}
    >
      <Link to="/about">About</Link>
      <Link to="/">Main page</Link>
      <Link to="/services">Services</Link>
      <Link to="/generate-pdf">PDF</Link>
    </div>
    <Outlet />
    <ReactQueryDevtools initialIsOpen={false} />
    <React.Suspense fallback={null}>
      <TanStackRouterDevtools />
    </React.Suspense>
  </>
);

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: Root,
});
