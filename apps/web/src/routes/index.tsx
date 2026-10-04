import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Moon, RefreshCw, Sprout, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { readinessOptions } from "@/lib/api";
export const Route = createFileRoute("/")({ component: Home });
function Home() {
  const health = useQuery(readinessOptions);
  const [dark, setDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  const connected = health.data?.status === "ready" && !health.isError;
  const status = health.isFetching
    ? "Checking connection"
    : connected
      ? "Connected"
      : "Connection unavailable";
  return (
    <div className="min-h-svh bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-10 focus:bg-background focus:p-3"
      >
        Skip to content
      </a>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-7 sm:px-10">
        <a
          href="/"
          aria-label="Noola home"
          className="flex items-center gap-2.5 text-xl font-semibold tracking-tight"
        >
          <Sprout aria-hidden="true" className="size-7 text-primary" />
          noola<span className="text-primary">.</span>
        </a>
        <Button
          variant="ghost"
          className="min-h-11 min-w-11"
          aria-label={dark ? "Use light theme" : "Use dark theme"}
          onClick={() => setDark(!dark)}
        >
          {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        </Button>
      </header>
      <main
        id="main"
        className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-14 sm:px-10 sm:py-24 lg:grid-cols-[1.2fr_1fr] lg:gap-24"
      >
        <section aria-labelledby="welcome-title">
          <p className="mb-7 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            A little more room for life
          </p>
          <h1
            id="welcome-title"
            className="max-w-xl text-5xl font-medium leading-[1.08] tracking-tight sm:text-7xl"
          >
            Space for what
            <br />
            <span className="text-primary">matters.</span>
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground">
            A quieter place for the things you want to remember, share, and come
            back to.
          </p>
          <div className="mt-10 flex items-center gap-3 text-sm">
            <span className="h-px w-9 bg-primary" />
            <span>Taking shape, one thoughtful step at a time.</span>
          </div>
        </section>
        <section
          aria-labelledby="preview-title"
          className="relative rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-10"
        >
          <div className="mb-12 flex items-start justify-between">
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              Foundation preview
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-5 text-muted-foreground"
            />
          </div>
          <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <Sprout aria-hidden="true" className="size-7 text-primary" />
          </div>
          <h2
            id="preview-title"
            className="text-2xl font-medium tracking-tight"
          >
            A fresh beginning.
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The foundation is here. Your personal space will grow from here.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            This is an early preview. Accounts and household features are not
            available yet.
          </p>
          <div className="mt-10 border-t border-border pt-6">
            <p
              role="status"
              aria-live="polite"
              className="mb-4 flex items-center gap-2 text-sm"
            >
              <span
                aria-hidden="true"
                className={`size-2 rounded-full ${connected ? "bg-primary" : "bg-muted-foreground"}`}
              />
              {status}
            </p>
            <Button
              variant="outline"
              className="min-h-11"
              disabled={health.isFetching}
              onClick={() => void health.refetch()}
            >
              <RefreshCw
                aria-hidden="true"
                className={health.isFetching ? "motion-safe:animate-spin" : ""}
              />
              Check connection
            </Button>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-6 py-8 text-xs text-muted-foreground sm:px-10">
        <p>Made for the everyday.</p>
        <p>Noola · Foundation preview</p>
      </footer>
    </div>
  );
}
