import type { CurrentAdult } from "@noola/contracts/identity";
import { passwordSchema } from "@noola/contracts/identity";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Feedback } from "@/components/patterns/feedback";
import { useAppForm } from "@/components/patterns/form";
import { Badge } from "@/components/ui/badge";
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
import { clearPrivateState } from "./session-scope";
import { useAction, useRequestIdentity } from "./use-action";
export function Devices({ adult }: { adult: CurrentAdult }) {
  const devices = useQuery({
    queryKey: ["identity", "devices"],
    queryFn: ({ signal }) => identityClient.call("devices", signal),
  });
  const query = useQueryClient();
  const action = useAction();
  const requestIdentity = useRequestIdentity();
  const form = useAppForm({
    defaultValues: { label: adult.device.label, mode: adult.device.mode },
    onSubmit: async ({ value }) => {
      if (
        await action.run(() =>
          identityClient.call("deviceCommand", {
            action: "update",
            deviceId: adult.device.id,
            ...value,
          }),
        )
      ) {
        await query.invalidateQueries({ queryKey: ["identity"] });
      }
    },
  });
  const revoke = async (deviceId?: string) => {
    if (
      await action.run(() =>
        requestIdentity(
          deviceId
            ? { action: "revoke", deviceId }
            : { action: "revoke-others" },
          (requestId, input) =>
            identityClient.call("deviceCommand", { ...input, requestId }),
        ),
      )
    ) {
      if (deviceId === adult.device.id) clearPrivateState("signed-out");
      else await query.invalidateQueries({ queryKey: ["identity", "devices"] });
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-medium">Your devices and security</h1>
      <p className="text-muted-foreground">
        Only your own sessions appear here. Background refresh does not keep a
        session active.
      </p>
      <div className="grid items-start gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>This device</CardTitle>
            <CardDescription>
              Shared by default. Choose personal only for a device you control.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.AppField name="label">
                  {(field) => <field.TextField label="Device label" />}
                </form.AppField>
                <form.AppField name="mode">
                  {(field) => (
                    <field.SelectField
                      label="Device mode"
                      options={[
                        {
                          value: "shared",
                          label: "Shared · 5-minute lock and background lock",
                        },
                        {
                          value: "personal",
                          label: "Personal · 15-minute inactivity lock",
                        },
                      ]}
                    />
                  )}
                </form.AppField>
                <form.AppForm>
                  <form.Submit>Save device preferences</form.Submit>
                </form.AppForm>
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Unlocking always requires fresh password sign-in.
            </p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active sessions</CardTitle>
            <CardDescription>
              Revocation takes effect on the server when confirmed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-4">
              {devices.data?.map((device) => (
                <li
                  key={device.id}
                  className="flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <span>
                      {device.label}{" "}
                      {device.current && (
                        <Badge variant="secondary">Current</Badge>
                      )}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {device.mode} · {device.locked ? "locked" : "active"}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    disabled={action.pending}
                    onClick={() => void revoke(device.id)}
                  >
                    Revoke session
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              disabled={action.pending}
              onClick={() => void revoke()}
            >
              Revoke other sessions
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Feedback {...action.feedback} />
      <ChangePassword />
    </div>
  );
}
function ChangePassword() {
  const action = useAction();
  const form = useAppForm({
    defaultValues: { currentPassword: "", newPassword: "" },
    validators: {
      onSubmit: z.object({
        currentPassword: z.string().min(1).max(128),
        newPassword: passwordSchema,
      }),
    },
    onSubmit: async ({ value }) => {
      if (
        await action.run(
          () => identityClient.auth("change-password", value),
          "Password changed. Other sessions were revoked.",
        )
      )
        form.reset();
    },
  });
  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>
          Verify your current password. Other devices will need to sign in
          again.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField name="currentPassword">
              {(field) => (
                <field.TextField
                  label="Current password"
                  type="password"
                  autoComplete="current-password"
                />
              )}
            </form.AppField>
            <form.AppField name="newPassword">
              {(field) => (
                <field.TextField
                  label="New password"
                  type="password"
                  autoComplete="new-password"
                />
              )}
            </form.AppField>
            <Feedback {...action.feedback} />
            <form.AppForm>
              <form.Submit>Change my password</form.Submit>
            </form.AppForm>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Use your own email for independent password recovery.
        </p>
      </CardFooter>
    </Card>
  );
}
