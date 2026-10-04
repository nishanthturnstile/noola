import type { CurrentAdult, Dependent } from "@noola/contracts/identity";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useAction, useRequestIdentity } from "@/features/account/use-action";
import { identityClient } from "@/lib/identity";
export function DependentSetup({ adult }: { adult: CurrentAdult }) {
  const profiles = useQuery({
    queryKey: ["identity", "dependents"],
    queryFn: ({ signal }) => identityClient.call("dependents", signal),
  });
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-medium">Optional dependent setup</h1>
      <p className="max-w-2xl text-muted-foreground">
        A parent-managed profile has no child login. Ownership and accepted
        guardianship are separate. You can skip this setup.
      </p>
      {!adult.settings.values.completed ? (
        <Feedback message="Complete your basic account setup before optional dependent setup." />
      ) : profiles.data?.length ? (
        profiles.data.map((profile) => (
          <DependentProfile
            key={`${profile.id}:${profile.revision}`}
            adult={adult}
            profile={profile}
          />
        ))
      ) : adult.role === "owner" ? (
        <CreateDependent />
      ) : (
        <Feedback message="No dependent profile is currently available to your account. Guardian access requires an independently accepted proposal." />
      )}
    </div>
  );
}
function CreateDependent() {
  const query = useQueryClient();
  const action = useAction();
  const requestIdentity = useRequestIdentity();
  const form = useAppForm({
    defaultValues: { displayName: "", birthDate: "" },
    onSubmit: async ({ value }) => {
      if (
        await action.run(() =>
          requestIdentity(
            {
              action: "create",
              displayName: value.displayName,
              birthDate: value.birthDate || null,
            },
            (requestId, input) =>
              identityClient.call("dependentCommand", { ...input, requestId }),
          ),
        )
      )
        await query.invalidateQueries({ queryKey: ["identity", "dependents"] });
    },
  });
  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Create the dependent profile</CardTitle>
        <CardDescription>
          The household owner owns this profile. Use synthetic details at this
          local checkpoint.
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
            <form.AppField name="displayName">
              {(field) => (
                <field.TextField
                  label="Dependent display name"
                  autoComplete="off"
                />
              )}
            </form.AppField>
            <form.AppField name="birthDate">
              {(field) => (
                <field.TextField
                  label="Birth date (optional)"
                  type="date"
                  autoComplete="off"
                />
              )}
            </form.AppField>
            <Feedback {...action.feedback} />
            <form.AppForm>
              <form.Submit>Create dependent profile</form.Submit>
            </form.AppForm>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Creating a profile does not accept guardian status.
        </p>
      </CardFooter>
    </Card>
  );
}
function DependentProfile({
  adult,
  profile,
}: {
  adult: CurrentAdult;
  profile: Dependent;
}) {
  const query = useQueryClient();
  const action = useAction();
  const requestIdentity = useRequestIdentity();
  const household = useQuery({
    queryKey: ["identity", "household"],
    queryFn: ({ signal }) => identityClient.call("household", signal),
  });
  const run = async (work: () => Promise<unknown>) => {
    if (await action.run(work))
      await query.invalidateQueries({ queryKey: ["identity", "dependents"] });
  };
  const form = useAppForm({
    defaultValues: {
      displayName: profile.displayName,
      birthDate: profile.birthDate ?? "",
    },
    onSubmit: async ({ value }) => {
      await run(() =>
        identityClient.call("dependentCommand", {
          action: "update",
          dependentId: profile.id,
          expectedRevision: profile.revision,
          displayName: value.displayName,
          birthDate: value.birthDate || null,
        }),
      );
    },
  });
  const correction = useAppForm({
    defaultValues: { text: "" },
    onSubmit: async ({ value }) => {
      await run(() =>
        requestIdentity(
          {
            action: "request-correction",
            dependentId: profile.id,
            text: value.text,
          },
          (requestId, input) =>
            identityClient.call("dependentCommand", { ...input, requestId }),
        ),
      );
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>{profile.displayName}</CardTitle>
        <CardDescription>
          {profile.canEdit
            ? "You own this profile. Guardian status is accepted separately."
            : "Guardian access to sensitive information is read-only. Changes, exports, and disclosure remain owner-controlled."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {profile.canEdit ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.AppField name="displayName">
                  {(field) => (
                    <field.TextField label="Dependent display name" />
                  )}
                </form.AppField>
                <form.AppField name="birthDate">
                  {(field) => (
                    <field.TextField
                      label="Birth date (optional)"
                      type="date"
                    />
                  )}
                </form.AppField>
                <form.AppForm>
                  <form.Submit>Save dependent profile</form.Submit>
                </form.AppForm>
              </FieldGroup>
            </form>
          ) : (
            profile.birthDate && <p>Birth date: {profile.birthDate}</p>
          )}
          <section className="flex flex-col gap-3">
            <h2 className="font-medium">Guardian roles</h2>
            {household.data?.members.map((member) => (
              <div
                key={member.id}
                className="flex flex-wrap items-center justify-between gap-3"
              >
                <span>
                  {member.name}{" "}
                  <Badge variant="secondary">
                    {profile.guardians.some(
                      (g) => g.userId === member.id && g.accepted,
                    )
                      ? "Accepted guardian"
                      : "Not a guardian"}
                  </Badge>
                </span>
                {(profile.canEdit ||
                  profile.guardians.some(
                    (g) => g.userId === adult.id && g.accepted,
                  )) && (
                  <Button
                    variant="outline"
                    disabled={
                      action.pending ||
                      profile.proposals.some((p) => p.state === "pending")
                    }
                    onClick={() =>
                      void run(() =>
                        requestIdentity(
                          {
                            action: "propose-guardian",
                            dependentId: profile.id,
                            targetId: member.id,
                            expectedRevision: profile.revision,
                            change: profile.guardians.some(
                              (g) => g.userId === member.id && g.accepted,
                            )
                              ? "remove"
                              : "add",
                          },
                          (requestId, input) =>
                            identityClient.call("dependentCommand", {
                              ...input,
                              requestId,
                            }),
                        ),
                      )
                    }
                  >
                    Propose{" "}
                    {profile.guardians.some(
                      (g) => g.userId === member.id && g.accepted,
                    )
                      ? "removal"
                      : "guardianship"}
                  </Button>
                )}
              </div>
            ))}
          </section>
          {profile.proposals.map((proposal) => (
            <section key={proposal.id} className="flex flex-col gap-3">
              <p>
                Guardian {proposal.action} proposal ·{" "}
                <Badge variant="secondary">{proposal.state}</Badge> ·{" "}
                {proposal.approvals.length} independent approvals
              </p>
              {proposal.state === "pending" && (
                <div className="flex flex-wrap gap-3">
                  <Button
                    disabled={
                      action.pending || proposal.approvals.includes(adult.id)
                    }
                    onClick={() =>
                      void run(() =>
                        requestIdentity(
                          {
                            action: "decide-guardian",
                            proposalId: proposal.id,
                            revision: proposal.revision,
                            accept: true,
                          },
                          (requestId, input) =>
                            identityClient.call("dependentCommand", {
                              ...input,
                              requestId,
                            }),
                        ),
                      )
                    }
                  >
                    {proposal.targetId === adult.id
                      ? "Accept my guardian role change"
                      : "Approve this guardian change"}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={action.pending}
                    onClick={() =>
                      void run(() =>
                        requestIdentity(
                          {
                            action: "decide-guardian",
                            proposalId: proposal.id,
                            revision: proposal.revision,
                            accept: false,
                          },
                          (requestId, input) =>
                            identityClient.call("dependentCommand", {
                              ...input,
                              requestId,
                            }),
                        ),
                      )
                    }
                  >
                    Decline guardian change
                  </Button>
                </div>
              )}
            </section>
          ))}
          {profile.guardians.some(
            (g) => g.userId === adult.id && g.accepted,
          ) && (
            <Button
              variant="outline"
              disabled={action.pending}
              onClick={() =>
                void run(() =>
                  requestIdentity(
                    { action: "relinquish", dependentId: profile.id },
                    (requestId, input) =>
                      identityClient.call("dependentCommand", {
                        ...input,
                        requestId,
                      }),
                  ),
                )
              }
            >
              Relinquish my guardian role
            </Button>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void correction.handleSubmit();
            }}
          >
            <FieldGroup>
              <correction.AppField name="text">
                {(field) => (
                  <field.TextField
                    label="Request a correction from the owner"
                    area
                  />
                )}
              </correction.AppField>
              <correction.AppForm>
                <correction.Submit>Send correction request</correction.Submit>
              </correction.AppForm>
            </FieldGroup>
          </form>
          {profile.corrections.map((c) => (
            <div key={c.id} className="flex flex-col gap-3">
              <p>{c.text}</p>
              <Badge variant="secondary">
                {c.state} · attributed to{" "}
                {household.data?.members.find((m) => m.id === c.authorId)
                  ?.name ?? "its author"}
              </Badge>
              {profile.canEdit && c.state === "pending" && (
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() =>
                      void run(() =>
                        identityClient.call("dependentCommand", {
                          action: "review-correction",
                          correctionId: c.id,
                          decision: "reviewed",
                        }),
                      )
                    }
                  >
                    Mark reviewed
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      void run(() =>
                        identityClient.call("dependentCommand", {
                          action: "review-correction",
                          correctionId: c.id,
                          decision: "declined",
                        }),
                      )
                    }
                  >
                    Decline correction
                  </Button>
                </div>
              )}
            </div>
          ))}
          <Feedback {...action.feedback} />
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          No guardian can independently remove another guardian. Sensitive
          download and disclosure are unavailable here.
        </p>
      </CardFooter>
    </Card>
  );
}
