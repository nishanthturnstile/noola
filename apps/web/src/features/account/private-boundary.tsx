import type { CurrentAdult } from "@noola/contracts/identity";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Feedback } from "@/components/patterns/feedback";
import { Button } from "@/components/ui/button";
import { identityClient } from "@/lib/identity";
import {
  clearPrivateState,
  reconcileRestriction,
  setPrivateAuthority,
  useSessionPolicy,
} from "./session-scope";
import { SignIn } from "./sign-in";
export function PrivateBoundary({
  children,
}: {
  children: (adult: CurrentAdult) => React.ReactNode;
}) {
  const location = useLocation();
  const registerPolicy = useSessionPolicy();
  const [checking, setChecking] = useState(true);
  const [failure, setFailure] = useState("");
  useEffect(() => {
    let alive = true;
    void reconcileRestriction()
      .then(() => {
        if (alive) setChecking(false);
      })
      .catch(() => {
        if (alive)
          setFailure(
            "This device was cleared. Connect to finish locking or signing out before continuing.",
          );
      });
    return () => {
      alive = false;
    };
  }, []);
  const me = useQuery({
    queryKey: ["identity", "me", location.href],
    queryFn: ({ signal }) => identityClient.call("me", signal),
    enabled: !checking && !failure,
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  });
  useLayoutEffect(() => {
    if (!me.data) return;
    registerPolicy(me.data.device);
    if (me.data.device.mode !== "personal") return;
    const hidden = () => {
      if (document.visibilityState === "hidden") setChecking(true);
      else {
        void reconcileRestriction()
          .then(() => me.refetch())
          .then((result) => {
            if (result.isSuccess) setChecking(false);
            else clearPrivateState("signed-out", false);
          })
          .catch(() => {
            setFailure(
              "Connect to confirm this device's background check before continuing.",
            );
          });
      }
    };
    document.addEventListener("visibilitychange", hidden);
    return () => {
      document.removeEventListener("visibilitychange", hidden);
    };
  }, [me.data, me.refetch, registerPolicy]);
  if (failure)
    return (
      <div className="mx-auto flex max-w-lg flex-col gap-6 p-6">
        <Feedback message={failure} />
        <Button onClick={() => window.location.reload()}>
          Reconnect and check
        </Button>
      </div>
    );
  if (checking || me.isPending)
    return (
      <p role="status" className="p-8">
        Checking your account…
      </p>
    );
  if (me.isError) {
    setPrivateAuthority(false);
    return <SignIn notice={"Sign in to open your private space."} />;
  }
  return children(me.data);
}
