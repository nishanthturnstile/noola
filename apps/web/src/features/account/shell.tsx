import type { CurrentAdult } from "@noola/contracts/identity";
import { Link } from "@tanstack/react-router";
import { LockKeyhole, LogOut, Sprout } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { restrictSession } from "./session-scope";
export function AccountShell({
  adult,
  children,
}: {
  adult?: CurrentAdult;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:bg-background focus:p-4"
      >
        Skip to content
      </a>
      <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold">
          <Sprout className="size-6 text-primary" aria-hidden="true" />
          noola.
        </Link>
        {adult ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm">{adult.name}</span>
            <Badge variant="secondary">Your account · private</Badge>
            <Button
              variant="ghost"
              onClick={() => void restrictSession("lock")}
            >
              <LockKeyhole data-icon="inline-start" />
              Lock
            </Button>
            <Button
              variant="outline"
              onClick={() => void restrictSession("sign-out")}
            >
              <LogOut data-icon="inline-start" />
              Sign out
            </Button>
          </div>
        ) : (
          <Link to="/recovery" className="text-sm underline underline-offset-4">
            Recovery help
          </Link>
        )}
      </header>
      <main id="main" className="mx-auto max-w-5xl px-6 pb-16 pt-8">
        {children}
      </main>
      <footer className="mx-auto flex max-w-5xl flex-wrap justify-between gap-4 px-6 py-8 text-sm text-muted-foreground">
        <span>Made for the everyday.</span>
        <Link to="/recovery" className="underline underline-offset-4">
          Account recovery guide
        </Link>
      </footer>
    </div>
  );
}
