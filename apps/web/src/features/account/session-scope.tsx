import { createIdentityClient } from "@noola/api-client";
import type { CurrentAdult } from "@noola/contracts/identity";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { z } from "zod";
import {
  discardPrivateRequests,
  IdentityApiError,
  identityClient,
  setClientAuthority,
} from "@/lib/identity";

const SessionPolicyContext = createContext<
  (device: CurrentAdult["device"]) => void
>(() => {});
export function useSessionPolicy() {
  return useContext(SessionPolicyContext);
}

let active = false;
export function setPrivateAuthority(value: boolean) {
  active = value;
  setClientAuthority(value);
}
export function hasPrivateAuthority() {
  return active;
}
export function clearPrivateState(reason: string, broadcast = true) {
  window.dispatchEvent(
    new CustomEvent("noola-clear", { detail: { reason, broadcast } }),
  );
}
// Restrictions return only a status and must finish even after private requests
// and mounted forms have been discarded.
const restrictionClient = createIdentityClient("", (input, init) =>
  fetch(input, { ...init, keepalive: true }),
);
const restrictionSchema = z.object({
  kind: z.enum(["lock", "sign-out", "check-background"]),
  requestId: z.uuid(),
});
function queueRestriction(kind: z.infer<typeof restrictionSchema>["kind"]) {
  const priority = { "check-background": 0, lock: 1, "sign-out": 2 };
  const snapshot = localStorage.getItem("noola-restriction");
  if (snapshot) {
    const pending = restrictionSchema.parse(JSON.parse(snapshot));
    if (priority[pending.kind] >= priority[kind]) return;
  }
  localStorage.setItem(
    "noola-restriction",
    JSON.stringify({ kind, requestId: crypto.randomUUID() }),
  );
}
let restrictionPending: Promise<void> | undefined;
export async function restrictSession(
  kind: "lock" | "sign-out" | "check-background",
) {
  queueRestriction(kind);
  clearPrivateState(kind === "sign-out" ? "signed-out" : "locked");
  try {
    await reconcileRestriction();
  } catch {
    /* A content-free restriction must reconcile before protected use. */
  }
}
async function checkBackgroundPolicy() {
  queueRestriction("check-background");
  try {
    await reconcileRestriction();
  } catch {
    /* Keep the background check pending until server policy can be confirmed. */
  }
}
export async function reconcileRestriction() {
  if (restrictionPending) return restrictionPending;
  restrictionPending = finishRestriction();
  try {
    await restrictionPending;
  } finally {
    restrictionPending = undefined;
  }
}
async function finishRestriction() {
  const snapshot = localStorage.getItem("noola-restriction");
  if (!snapshot) return;
  const restriction = restrictionSchema.parse(JSON.parse(snapshot));
  try {
    if (restriction.kind === "check-background") {
      const result = await restrictionClient.call("deviceCommand", {
        action: "background",
      });
      if (result.locked && hasPrivateAuthority()) clearPrivateState("locked");
    } else
      await (restriction.kind === "lock"
        ? restrictionClient.call("deviceCommand", { action: "lock" })
        : restrictionClient.auth("sign-out", {}));
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !(
        "code" in error &&
        ["locked", "unauthorized"].includes(String(error.code))
      )
    )
      throw error;
    if (restriction.kind === "check-background" && hasPrivateAuthority())
      clearPrivateState("signed-out");
  }
  // A completed older restriction cannot clear a newer offline request.
  if (localStorage.getItem("noola-restriction") === snapshot)
    localStorage.removeItem("noola-restriction");
  else await finishRestriction();
}
export function SessionScope({
  children,
}: {
  children: (epoch: number) => React.ReactNode;
}) {
  const uncertain = useRef(true);
  const policy = useRef<{
    id: string;
    mode: "shared" | "personal";
    lastActivity: number;
    lastSent: number;
  } | null>(null);
  const register = useCallback((device: CurrentAdult["device"]) => {
    const previous = policy.current;
    policy.current = {
      id: device.id,
      mode: device.mode,
      lastActivity: Math.max(
        Date.parse(device.lastActivity),
        previous?.id === device.id ? previous.lastActivity : 0,
      ),
      lastSent: previous?.id === device.id ? previous.lastSent : 0,
    };
    uncertain.current = false;
    setPrivateAuthority(true);
    if (device.mode === "shared" && document.visibilityState === "hidden")
      void restrictSession("lock");
  }, []);
  const [scope, setScope] = useState(() => ({
    epoch: 0,
    client: new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0,
          gcTime: 0,
          refetchOnWindowFocus: false,
        },
        mutations: { retry: false },
      },
    }),
  }));
  useLayoutEffect(() => {
    let alive = true;
    // Public routes and new tabs also enforce the cookie's device policy.
    void reconcileRestriction()
      .then(async () => {
        if (!alive) return;
        const adult = await identityClient.call("me");
        if (alive && !policy.current) register(adult.device);
      })
      .catch((error: unknown) => {
        if (
          alive &&
          error instanceof IdentityApiError &&
          ["unauthorized", "locked"].includes(error.code)
        )
          uncertain.current = false;
      });
    const channel =
      typeof BroadcastChannel !== "undefined"
        ? new BroadcastChannel("noola-authority")
        : null;
    const clear = (event: Event) => {
      alive = false;
      const detail =
        event instanceof CustomEvent
          ? event.detail
          : { reason: "signed-out", broadcast: false };
      active = false;
      policy.current = null;
      uncertain.current = true;
      discardPrivateRequests();
      void scope.client.cancelQueries();
      scope.client.clear();
      if (detail.broadcast) {
        if (channel) channel.postMessage({ reason: detail.reason });
        else localStorage.setItem("noola-clear-signal", crypto.randomUUID());
      }
      if (detail.reason !== "signed-in")
        window.history.replaceState(null, "", "/sign-in");
      else window.history.replaceState(null, "", "/account");
      setScope((previous) => ({
        epoch: previous.epoch + 1,
        client: new QueryClient({
          defaultOptions: {
            queries: {
              retry: false,
              staleTime: 0,
              gcTime: 0,
              refetchOnWindowFocus: false,
            },
            mutations: { retry: false },
          },
        }),
      }));
    };
    const receive = (event: MessageEvent) =>
      clearPrivateState(
        event.data?.reason === "signed-in" ? "signed-in" : "signed-out",
        false,
      );
    channel?.addEventListener("message", receive);
    window.addEventListener("noola-clear", clear);
    const storage = (event: StorageEvent) => {
      if (event.key === "noola-clear-signal")
        clearPrivateState("signed-out", false);
    };
    window.addEventListener("storage", storage);
    const activity = (event: Event) => {
      if (!policy.current || !event.isTrusted) return;
      policy.current.lastActivity = Date.now();
      if (Date.now() - policy.current.lastSent > 20000) {
        policy.current.lastSent = Date.now();
        void identityClient
          .call("deviceCommand", { action: "activity" })
          .catch(() => {});
      }
    };
    const hidden = () => {
      if (document.visibilityState !== "hidden") return;
      if (policy.current?.mode === "shared")
        void restrictSession("check-background");
      else if (policy.current) void checkBackgroundPolicy();
      else if (uncertain.current) void restrictSession("check-background");
    };
    const hide = () => {
      if (!policy.current) {
        if (uncertain.current) void restrictSession("check-background");
        return;
      }
      void restrictSession("check-background");
    };
    const resume = (event: PageTransitionEvent) => {
      if (active && event.persisted) clearPrivateState("signed-out", false);
    };
    const timer = setInterval(() => {
      const device = policy.current;
      if (
        device &&
        Date.now() - device.lastActivity >=
          (device.mode === "personal" ? 15 : 5) * 60000
      )
        void restrictSession("lock");
    }, 1000);
    for (const name of ["pointerdown", "keydown", "touchstart"])
      window.addEventListener(name, activity);
    document.addEventListener("visibilitychange", hidden);
    window.addEventListener("pagehide", hide);
    window.addEventListener("pageshow", resume);
    return () => {
      alive = false;
      clearInterval(timer);
      channel?.close();
      window.removeEventListener("noola-clear", clear);
      window.removeEventListener("storage", storage);
      for (const name of ["pointerdown", "keydown", "touchstart"])
        window.removeEventListener(name, activity);
      document.removeEventListener("visibilitychange", hidden);
      window.removeEventListener("pagehide", hide);
      window.removeEventListener("pageshow", resume);
    };
  }, [scope.client, register]);
  return (
    <SessionPolicyContext.Provider value={register}>
      <QueryClientProvider key={scope.epoch} client={scope.client}>
        {children(scope.epoch)}
      </QueryClientProvider>
    </SessionPolicyContext.Provider>
  );
}
