import { emailSchema, enrollmentSchema } from "@noola/contracts/identity";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Feedback } from "@/components/patterns/feedback";
import { useAppForm } from "@/components/patterns/form";
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
import { clearPrivateState, reconcileRestriction } from "./session-scope";
import { AccountShell } from "./shell";
import { useAction, useRequestIdentity } from "./use-action";
export function useLinkSecret() {
  const [token] = useState(
    () => new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "",
  );
  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
  }, []);
  return token;
}
export function Enrollment() {
  const token = useLinkSecret();
  const [complete, setComplete] = useState(false);
  const action = useAction();
  const requestIdentity = useRequestIdentity();
  const form = useAppForm({
    defaultValues: { email: "", name: "", password: "" },
    validators: {
      onSubmit: enrollmentSchema.omit({ requestId: true, token: true }),
    },
    onSubmit: async ({ value }) => {
      const body = { ...value, token };
      if (
        await action.run(
          () =>
            requestIdentity(body, (requestId) =>
              identityClient.call("enrollment", { ...body, requestId }),
            ),
          "Your account is ready for verification. Check your email, then sign in.",
        )
      ) {
        form.reset();
        setComplete(true);
      }
    },
  });
  return (
    <AccountShell>
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl">Your fresh beginning.</h1>
          </CardTitle>
          <CardDescription>
            Set up your own Noola account with the email this invitation was
            sent to.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {complete ? (
            <Feedback {...action.feedback} />
          ) : !token ? (
            <Feedback message="Open the invitation from your email. If it expired, ask for a new invitation." />
          ) : (
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
                      label="Invited email"
                      type="email"
                      autoComplete="email"
                    />
                  )}
                </form.AppField>
                <form.AppField name="name">
                  {(field) => (
                    <field.TextField label="Display name" autoComplete="name" />
                  )}
                </form.AppField>
                <form.AppField name="password">
                  {(field) => (
                    <field.TextField
                      label="Choose a password"
                      type="password"
                      autoComplete="new-password"
                      hint="12–128 characters. Password managers and paste are welcome."
                    />
                  )}
                </form.AppField>
                <Feedback {...action.feedback} />
                <form.AppForm>
                  <form.Submit>Create my account</form.Submit>
                </form.AppForm>
              </FieldGroup>
            </form>
          )}
          {token && !complete && (
            <details className="mt-6">
              <summary className="cursor-pointer text-sm underline underline-offset-4">
                Join using an existing verified account
              </summary>
              <ExistingAccountJoin token={token} />
            </details>
          )}
        </CardContent>
        <CardFooter>
          <Link to="/sign-in" className="text-sm underline underline-offset-4">
            Already have an account? Sign in
          </Link>
        </CardFooter>
      </Card>
    </AccountShell>
  );
}

function ExistingAccountJoin({ token }: { token: string }) {
  const action = useAction();
  const requestIdentity = useRequestIdentity();
  const form = useAppForm({
    defaultValues: { email: "", password: "" },
    validators: {
      onSubmit: z.object({
        email: emailSchema,
        password: z.string().min(1).max(128),
      }),
    },
    onSubmit: async ({ value }) => {
      if (
        await action.run(async () => {
          await reconcileRestriction();
          await identityClient.auth("sign-in/email", value);
          await requestIdentity({ token, email: value.email }, (requestId) =>
            identityClient.call("join", { token, requestId }),
          );
        }, "Existing account joined without changing credentials.")
      ) {
        form.reset();
        clearPrivateState("signed-in");
      }
    },
  });
  return (
    <form
      className="mt-5"
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label="Existing verified email"
              type="email"
              autoComplete="username"
            />
          )}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.TextField
              label="Existing password"
              type="password"
              autoComplete="current-password"
            />
          )}
        </form.AppField>
        <Feedback {...action.feedback} />
        <form.AppForm>
          <form.Submit>Sign in and join</form.Submit>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
