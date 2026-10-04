import { type CurrentAdult, preferenceSchema } from "@noola/contracts/identity";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { identityClient } from "@/lib/identity";
import { useAction } from "./use-action";

const choices = (values: readonly string[]) =>
  values.map((value) => ({ value, label: value }));
export function AccountSetup({ adult }: { adult: CurrentAdult }) {
  const values = adult.settings.values;
  const resume = !values.language
    ? 0
    : !values.units
      ? 1
      : values.disclosureRevision !== adult.disclosure.revision
        ? 2
        : !values.completed
          ? 3
          : 4;
  const [editing, setEditing] = useState<number | null>(null);
  const step = editing ?? resume;
  const query = useQueryClient();
  const action = useAction();
  const form = useAppForm({
    defaultValues: {
      name: adult.name,
      language: values.language ?? "English",
      tone: values.tone ?? "concise",
      units: values.units ?? "metric",
      currency: values.currency ?? "INR",
      dateFormat: values.dateFormat ?? "DD MMM YYYY",
      timeZone: values.timeZone ?? "Asia/Kolkata",
      retention: values.retention ?? "180-days",
      notifications: values.notifications ?? false,
      quietHours: values.quietHours ?? false,
      acceptDisclosure: false,
    },
    onSubmit: async ({ value }) => {
      const preferences = preferenceSchema.parse(value);
      const names = [
        "identity",
        "presentation",
        "disclosure",
        "preferences",
      ] as const;
      const chosen = names[step];
      if (!chosen) return;
      if (
        await action.run(
          () =>
            identityClient.call("settings", {
              step: chosen,
              expectedRevision: adult.settings.revision,
              name: value.name,
              preferences,
              acceptDisclosure: value.acceptDisclosure,
            }),
          "Your choices were saved.",
        )
      ) {
        setEditing(null);
        await query.invalidateQueries({ queryKey: ["identity", "me"] });
      }
    },
  });
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-medium tracking-tight">
          Make yourself at home.
        </h1>
        <Badge variant="secondary">
          {step === 4 ? "Basic setup complete" : `Step ${step + 1} of 4`}
        </Badge>
      </div>
      <p className="max-w-2xl text-muted-foreground">
        A few personal choices, saved as you go. Household rules and guardian
        permissions are reviewed separately.
      </p>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>
            {
              [
                "Your identity",
                "Presentation defaults",
                "Hosting and operator access",
                "History and notifications",
                "Your personal settings",
              ][step]
            }
          </CardTitle>
          <CardDescription>
            {step === 4
              ? "These choices are private and stay editable by you."
              : "Review the offered defaults and accept the choices that suit you."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 4 ? (
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Interaction language</dt>
                <dd>{values.language}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Presentation</dt>
                <dd>
                  {values.tone} · {values.units} · {values.currency}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Dates and time</dt>
                <dd>
                  {values.dateFormat} · {values.timeZone}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">History retention</dt>
                <dd>{values.retention}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">
                  Notification preference
                </dt>
                <dd>
                  {values.notifications
                    ? "Enabled preference; push stays off"
                    : "Off"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Quiet hours</dt>
                <dd>
                  {values.quietHours
                    ? "10 PM–7 AM in your time zone"
                    : "Not enabled"}
                </dd>
              </div>
            </dl>
          ) : (
            <form
              id="setup-form"
              onSubmit={(e) => {
                e.preventDefault();
                void form.handleSubmit();
              }}
            >
              <FieldGroup>
                {step === 0 ? (
                  <>
                    <form.AppField
                      name="name"
                      validators={{
                        onSubmit: ({ value }) =>
                          value.trim().length > 0 && value.trim().length <= 80
                            ? undefined
                            : "Enter a display name of 1–80 characters.",
                      }}
                    >
                      {(field) => (
                        <field.TextField
                          label="Your display name"
                          autoComplete="name"
                        />
                      )}
                    </form.AppField>
                    <form.AppField name="language">
                      {(field) => (
                        <field.SelectField
                          label="Interaction language"
                          options={choices([
                            "English",
                            "Tamil",
                            "Tamil and English",
                          ])}
                        />
                      )}
                    </form.AppField>
                    <p className="text-sm text-muted-foreground">
                      Screens and account emails are currently in English. Your
                      interaction-language choice is stored for later features.
                    </p>
                  </>
                ) : step === 1 ? (
                  <>
                    <form.AppField name="tone">
                      {(field) => (
                        <field.SelectField
                          label="Answer style"
                          options={choices(["concise", "detailed"])}
                        />
                      )}
                    </form.AppField>
                    <form.AppField name="units">
                      {(field) => (
                        <field.SelectField
                          label="Units"
                          options={choices(["metric", "imperial"])}
                        />
                      )}
                    </form.AppField>
                    <form.AppField name="currency">
                      {(field) => (
                        <field.SelectField
                          label="Currency"
                          options={choices(["INR", "USD", "EUR"])}
                        />
                      )}
                    </form.AppField>
                    <form.AppField name="dateFormat">
                      {(field) => (
                        <field.SelectField
                          label="Date format"
                          options={choices(["DD MMM YYYY", "YYYY-MM-DD"])}
                        />
                      )}
                    </form.AppField>
                    <form.AppField name="timeZone">
                      {(field) => (
                        <field.SelectField
                          label="Time zone"
                          options={choices([
                            "Asia/Kolkata",
                            "UTC",
                            "Europe/London",
                            "America/New_York",
                          ])}
                        />
                      )}
                    </form.AppField>
                  </>
                ) : step === 2 ? (
                  <>
                    <p className="leading-relaxed">{adult.disclosure.text}</p>
                    <FieldSet>
                      <FieldLegend>Operator disclosure</FieldLegend>
                      <form.AppField
                        name="acceptDisclosure"
                        validators={{
                          onSubmit: ({ value }) =>
                            value
                              ? undefined
                              : "Review and acknowledge the disclosure to continue.",
                        }}
                      >
                        {(field) => (
                          <field.CheckField
                            label="I have read this operator-access disclosure"
                            hint={`Disclosure revision: ${adult.disclosure.revision}`}
                          />
                        )}
                      </form.AppField>
                    </FieldSet>
                    <Feedback message="AI processing is unavailable. No consent for future AI processors is being collected." />
                  </>
                ) : (
                  <>
                    <form.AppField name="retention">
                      {(field) => (
                        <field.SelectField
                          label="History retention"
                          options={[
                            { value: "temporary", label: "Temporary" },
                            { value: "30-days", label: "30 days" },
                            { value: "180-days", label: "180 days" },
                            {
                              value: "until-deleted",
                              label: "Until I delete it",
                            },
                          ]}
                        />
                      )}
                    </form.AppField>
                    <p className="text-sm text-muted-foreground">
                      Ordinary history is disabled until you accept a choice.
                      Capture and conversations arrive in later sections.
                    </p>
                    <FieldSet>
                      <FieldLegend>Notification preferences</FieldLegend>
                      <FieldGroup>
                        <form.AppField name="notifications">
                          {(field) => (
                            <field.CheckField
                              label="Store my preference for account notifications"
                              hint="Push is off; permissions and delivery are tested later."
                            />
                          )}
                        </form.AppField>
                        <form.AppField name="quietHours">
                          {(field) => (
                            <field.CheckField
                              label="Use quiet hours from 10 PM to 7 AM"
                              hint="This takes effect only if you accept it."
                            />
                          )}
                        </form.AppField>
                      </FieldGroup>
                    </FieldSet>
                  </>
                )}
                <Feedback {...action.feedback} />
                <form.AppForm>
                  <form.Submit>
                    {step === 3
                      ? "Accept and finish basic setup"
                      : "Save and continue"}
                  </form.Submit>
                </form.AppForm>
              </FieldGroup>
            </form>
          )}
        </CardContent>
        <CardFooter>
          {step === 4 ? (
            <div className="flex flex-wrap gap-2">
              {["Identity", "Presentation", "Disclosure", "Preferences"].map(
                (label, index) => (
                  <Button
                    key={label}
                    variant="outline"
                    onClick={() => {
                      form.reset();
                      setEditing(index);
                    }}
                  >
                    Edit {label.toLowerCase()}
                  </Button>
                ),
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              You can leave and resume this step later.
            </p>
          )}
        </CardFooter>
      </Card>
      <Feedback message="Private capture and the first save/share tutorial remain pending for later sections." />
    </div>
  );
}
