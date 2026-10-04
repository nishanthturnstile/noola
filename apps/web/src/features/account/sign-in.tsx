import { emailSchema } from "@noola/contracts/identity";
import { Link } from "@tanstack/react-router";
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
import { useAction } from "./use-action";

const schema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password.").max(128),
});
export function SignIn({ notice = "" }: { notice?: string }) {
  const action = useAction();
  const form = useAppForm({
    defaultValues: { email: "", password: "" },
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      if (
        await action.run(async () => {
          await reconcileRestriction();
          await identityClient.auth("sign-in/email", value);
        })
      ) {
        form.reset();
        clearPrivateState("signed-in");
      }
    },
  });
  return (
    <AccountShell>
      <div className="mx-auto grid max-w-4xl items-start gap-10 md:grid-cols-2">
        <section className="flex flex-col gap-5 md:pt-8">
          <p className="text-sm text-primary">A little more room for life</p>
          <h1 className="text-4xl font-medium tracking-tight">Welcome back.</h1>
          <p className="leading-relaxed text-muted-foreground">
            Your own account. Your own choices. A calmer place to start.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            New here? Open the invitation sent to your email to choose your own
            password. Verify your email before signing in.
          </p>
        </section>
        <Card>
          <CardHeader>
            <CardTitle>Sign in to Noola</CardTitle>
            <CardDescription>
              Use your independently controlled email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id="sign-in-form"
              onSubmit={(e) => {
                e.preventDefault();
                void form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.AppField name="email">
                  {(field) => (
                    <field.TextField
                      label="Email"
                      type="email"
                      autoComplete="username"
                    />
                  )}
                </form.AppField>
                <form.AppField name="password">
                  {(field) => (
                    <field.TextField
                      label="Password"
                      type="password"
                      autoComplete="current-password"
                    />
                  )}
                </form.AppField>
                <Feedback {...action.feedback} />
                {notice && (
                  <p role="status" className="text-sm text-muted-foreground">
                    {notice}
                  </p>
                )}
                {localStorage.getItem("noola-restriction") && (
                  <p role="status" className="text-sm text-muted-foreground">
                    Private state was cleared on this device. Server lock or
                    sign-out is unconfirmed until you connect; signing in first
                    confirms the restriction.
                  </p>
                )}
                <form.AppForm>
                  <form.Submit>Sign in</form.Submit>
                </form.AppForm>
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-4">
            <Link
              to="/forgot-password"
              className="text-sm underline underline-offset-4"
            >
              Forgot password?
            </Link>
            <Link to="/verify" className="text-sm underline underline-offset-4">
              Resend verification
            </Link>
          </CardFooter>
        </Card>
      </div>
    </AccountShell>
  );
}
