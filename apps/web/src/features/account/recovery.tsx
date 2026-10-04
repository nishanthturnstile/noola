import { emailSchema, passwordSchema } from "@noola/contracts/identity";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Feedback } from "@/components/patterns/feedback";
import { useAppForm } from "@/components/patterns/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { identityClient } from "@/lib/identity";
import { useLinkSecret } from "./enrollment";
import { clearPrivateState } from "./session-scope";
import { AccountShell } from "./shell";
import { useAction } from "./use-action";
export function EmailRequest({ kind }: { kind: "reset" | "verification" }) {
  const action = useAction();
  const form = useAppForm({
    defaultValues: { email: "" },
    validators: { onSubmit: z.object({ email: emailSchema }) },
    onSubmit: async ({ value }) => {
      await action.run(
        () =>
          identityClient.auth(
            kind === "reset"
              ? "request-password-reset"
              : "send-verification-email",
            value,
          ),
        "If this address is eligible, an account email has been queued. Check your email and use the latest valid link.",
      );
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label="Your email"
              type="email"
              autoComplete="email"
            />
          )}
        </form.AppField>
        <Feedback {...action.feedback} />
        <form.AppForm>
          <form.Submit>
            {kind === "reset" ? "Request reset link" : "Resend verification"}
          </form.Submit>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
export function ForgotPassword() {
  return (
    <AccountShell>
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl">Recover your account.</h1>
          </CardTitle>
          <CardDescription>
            A reset link goes to your own email. You do not need the other
            adult’s help.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmailRequest kind="reset" />
        </CardContent>
        <CardFooter>
          <Link to="/sign-in" className="underline underline-offset-4">
            Back to sign in
          </Link>
        </CardFooter>
      </Card>
    </AccountShell>
  );
}
export function VerifyEmail() {
  const token = useLinkSecret();
  const [done, setDone] = useState(false);
  const action = useAction();
  return (
    <AccountShell>
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl">Verify your email.</h1>
          </CardTitle>
          <CardDescription>
            Confirm that this email belongs to you, then sign in explicitly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            {token && !done ? (
              <Button
                disabled={action.pending}
                onClick={() =>
                  void action
                    .run(
                      () => identityClient.auth("verify-email", { token }),
                      "Email verified. You can now sign in.",
                    )
                    .then((ok) => {
                      if (ok) setDone(true);
                    })
                }
              >
                Verify my email
              </Button>
            ) : !done ? (
              <EmailRequest kind="verification" />
            ) : null}
            <Feedback {...action.feedback} />
          </div>
        </CardContent>
        <CardFooter>
          <Link to="/sign-in" className="underline underline-offset-4">
            Continue to sign in
          </Link>
        </CardFooter>
      </Card>
    </AccountShell>
  );
}
export function ResetPassword() {
  const token = useLinkSecret();
  const [done, setDone] = useState(false);
  const action = useAction();
  const form = useAppForm({
    defaultValues: { newPassword: "" },
    validators: { onSubmit: z.object({ newPassword: passwordSchema }) },
    onSubmit: async ({ value }) => {
      if (
        await action.run(
          () => identityClient.auth("reset-password", { ...value, token }),
          "Password reset. Your old sessions were revoked. Sign in with your new password.",
        )
      ) {
        form.reset();
        setDone(true);
        clearPrivateState("signed-out");
      }
    },
  });
  return (
    <AccountShell>
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl">Choose a new password.</h1>
          </CardTitle>
          <CardDescription>
            Your previous sessions will be revoked. The other adult’s account
            stays independent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!token ? (
            <Feedback message="Open a valid reset link from your email. Expired links can be replaced from Forgot password." />
          ) : done ? (
            <Feedback {...action.feedback} />
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.AppField name="newPassword">
                  {(field) => (
                    <field.TextField
                      label="New password"
                      type="password"
                      autoComplete="new-password"
                      hint="12–128 characters. You can paste or use your password manager."
                    />
                  )}
                </form.AppField>
                <Feedback {...action.feedback} />
                <form.AppForm>
                  <form.Submit>Reset my password</form.Submit>
                </form.AppForm>
              </FieldGroup>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <Link to="/sign-in" className="underline underline-offset-4">
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </AccountShell>
  );
}
export function RecoveryGuide() {
  return (
    <AccountShell>
      <article className="mx-auto flex max-w-2xl flex-col gap-6">
        <p className="text-sm text-primary">Always available</p>
        <h1 className="text-4xl font-medium tracking-tight">
          Account recovery guide
        </h1>
        <p className="leading-relaxed">
          Use Forgot password to request an expiring link through your own
          email. After a successful reset, all your previous device sessions are
          revoked. Sign in again with your new password.
        </p>
        <h2 className="text-xl font-medium">If a link expired</h2>
        <p>
          Request another link. Opening a reset page does not change your
          password; submitting a new password does. Never share a recovery or
          verification link.
        </p>
        <h2 className="text-xl font-medium">If a device is compromised</h2>
        <p>
          From a trusted device, revoke affected sessions or reset your
          password. Secure your email account too. An offline device cannot be
          remotely erased immediately; previously copied information cannot be
          recalled.
        </p>
        <h2 className="text-xl font-medium">If you lose your email account</h2>
        <p>
          Recover your mailbox through its provider. Noola recovery depends on
          your independently controlled email. The household coordinator cannot
          impersonate you, reset your credentials, or access your private
          content.
        </p>
        <h2 className="text-xl font-medium">What the operator can access</h2>
        <p>
          This local service runs on the operator’s computer. The operator can
          access database storage, captured account emails, and backups. The
          service does not promise secrecy from its operator. AI is unavailable
          and push is off. Hosted delivery and independent backup recovery
          require later validation.
        </p>
        <h2 className="text-xl font-medium">
          Shared devices and offline sign-out
        </h2>
        <p>
          Shared sessions lock when the app backgrounds or after five minutes of
          inactivity. Personal sessions lock after fifteen minutes. Local
          clearing happens immediately. If you are offline, server sign-out
          remains unconfirmed until reconnection; protected use waits for
          reconciliation.
        </p>
        <div className="flex flex-wrap gap-6">
          <Link to="/forgot-password" className="underline underline-offset-4">
            Forgot password
          </Link>
          <Link to="/sign-in" className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </article>
    </AccountShell>
  );
}
