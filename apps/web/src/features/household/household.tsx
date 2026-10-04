import type { CurrentAdult, Household } from "@noola/contracts/identity";
import { emailSchema } from "@noola/contracts/identity";
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
import { useAction, useRequestIdentity } from "@/features/account/use-action";
import { identityClient } from "@/lib/identity";
export function HouseholdSetup({ adult }: { adult: CurrentAdult }) {
  const household = useQuery({
    queryKey: ["identity", "household"],
    queryFn: ({ signal }) => identityClient.call("household", signal),
  });
  const query = useQueryClient();
  const action = useAction();
  const requestIdentity = useRequestIdentity();
  const run = async (work: () => Promise<unknown>) => {
    if (await action.run(work))
      await query.invalidateQueries({ queryKey: ["identity", "household"] });
  };
  const form = useAppForm({
    defaultValues: { email: "" },
    validators: { onSubmit: z.object({ email: emailSchema }) },
    onSubmit: async ({ value }) => {
      await run(() =>
        requestIdentity(
          { action: "invite", email: value.email },
          (requestId, input) =>
            identityClient.call("householdCommand", { ...input, requestId }),
        ),
      );
    },
  });
  if (!household.data) return <p role="status">Checking household setup…</p>;
  const data = household.data;
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-medium">Household, by agreement.</h1>
      <p className="text-muted-foreground">
        Shared setup · each adult keeps independent choices and recovery.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Two separate accounts</CardTitle>
            <CardDescription>
              Membership grants no access to another adult’s private settings or
              records.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {data.members.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center justify-between gap-2"
                >
                  <span>
                    {member.name}
                    {member.id === adult.id ? " (you)" : ""}
                  </span>
                  <Badge variant="secondary">{member.role}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              {data.sharedUse
                ? "Both adults accepted household rules. Shared use is eligible when features arrive."
                : "Cross-member use waits for both adults to accept the required rules."}
            </p>
          </CardFooter>
        </Card>
        {adult.role === "owner" && (
          <Card>
            <CardHeader>
              <CardTitle>Invite the second adult</CardTitle>
              <CardDescription>
                The recipient chooses their own password, profile, and
                preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.members.length + data.invitations.length >= 2 ? (
                <p className="text-sm text-muted-foreground">
                  The two adult slots are occupied or reserved.
                </p>
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
                          label="Other adult’s email"
                          type="email"
                          autoComplete="off"
                        />
                      )}
                    </form.AppField>
                    <form.AppForm>
                      <form.Submit>Send invitation</form.Submit>
                    </form.AppForm>
                  </FieldGroup>
                </form>
              )}
              {data.invitations.map((invite) => (
                <div key={invite.id} className="mt-4 flex flex-col gap-3">
                  <p>{invite.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {invite.state} · Email: {invite.emailStatus}. Transport
                    acceptance does not confirm inbox delivery.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      disabled={
                        action.pending || invite.state === "verification"
                      }
                      onClick={() =>
                        void run(() =>
                          requestIdentity(
                            { action: "resend", invitationId: invite.id },
                            (requestId, input) =>
                              identityClient.call("householdCommand", {
                                ...input,
                                requestId,
                              }),
                          ),
                        )
                      }
                    >
                      Resend invitation
                    </Button>
                    <Button
                      variant="outline"
                      disabled={
                        action.pending || invite.state === "verification"
                      }
                      onClick={() =>
                        void run(() =>
                          requestIdentity(
                            { action: "cancel", invitationId: invite.id },
                            (requestId, input) =>
                              identityClient.call("householdCommand", {
                                ...input,
                                requestId,
                              }),
                          ),
                        )
                      }
                    >
                      Cancel invitation
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Resending invalidates the previous unused link. Enrolled adults
                recover independently.
              </p>
            </CardFooter>
          </Card>
        )}
      </div>
      <Feedback {...action.feedback} />
      {data.agreements.map((agreement) => (
        <Card key={agreement.id}>
          <CardHeader>
            <CardTitle>
              Household rules · revision {agreement.revision}
            </CardTitle>
            <CardDescription>
              <Badge
                variant={
                  agreement.state === "accepted" ? "default" : "secondary"
                }
              >
                {agreement.state}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap leading-relaxed">
              {agreement.text}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              {
                agreement.decisions.filter((d) => d.decision === "accepted")
                  .length
              }{" "}
              independent acceptances.{" "}
              {agreement.decisions.some((d) => d.userId === adult.id)
                ? `Your decision: ${agreement.decisions.find((d) => d.userId === adult.id)?.decision}.`
                : "You have not decided."}
            </p>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3">
            {agreement.state === "pending" && (
              <>
                <Button
                  disabled={
                    action.pending ||
                    agreement.decisions.some(
                      (d) => d.userId === adult.id && d.decision === "accepted",
                    )
                  }
                  onClick={() =>
                    void run(() =>
                      requestIdentity(
                        {
                          action: "accept-rules",
                          agreementId: agreement.id,
                          revision: agreement.revision,
                        },
                        (requestId, input) =>
                          identityClient.call("householdCommand", {
                            ...input,
                            requestId,
                          }),
                      ),
                    )
                  }
                >
                  Accept this revision
                </Button>
                <Button
                  variant="outline"
                  disabled={action.pending}
                  onClick={() =>
                    void run(() =>
                      requestIdentity(
                        {
                          action: "decline-rules",
                          agreementId: agreement.id,
                          revision: agreement.revision,
                        },
                        (requestId, input) =>
                          identityClient.call("householdCommand", {
                            ...input,
                            requestId,
                          }),
                      ),
                    )
                  }
                >
                  Decline this revision
                </Button>
                {agreement.canCancel && (
                  <Button
                    variant="outline"
                    disabled={action.pending}
                    onClick={() =>
                      void run(() =>
                        requestIdentity(
                          {
                            action: "cancel-rules",
                            agreementId: agreement.id,
                            revision: agreement.revision,
                          },
                          (requestId, input) =>
                            identityClient.call("householdCommand", {
                              ...input,
                              requestId,
                            }),
                        ),
                      )
                    }
                  >
                    Cancel my proposal
                  </Button>
                )}
              </>
            )}
            <p className="text-sm text-muted-foreground">
              Declining preserves your account and personal setup.
            </p>
          </CardFooter>
        </Card>
      ))}
      <RulesProposal household={data} />
    </div>
  );
}
function RulesProposal({ household }: { household: Household }) {
  const query = useQueryClient();
  const action = useAction();
  const requestIdentity = useRequestIdentity();
  const form = useAppForm({
    defaultValues: { text: household.agreements[0]?.text ?? "" },
    validators: {
      onSubmit: z.object({ text: z.string().trim().min(10).max(4000) }),
    },
    onSubmit: async ({ value }) => {
      if (
        await action.run(
          () =>
            requestIdentity(
              {
                action: "propose-rules",
                expectedRevision: household.revision,
                text: value.text,
              },
              (requestId, input) =>
                identityClient.call("householdCommand", {
                  ...input,
                  requestId,
                }),
            ),
          "A new revision is pending independent review.",
        )
      )
        await query.invalidateQueries({ queryKey: ["identity", "household"] });
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Propose a change</CardTitle>
        <CardDescription>
          Existing accepted rules stay in force. New rules need fresh, separate
          acceptances within 24 hours.
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
            <form.AppField name="text">
              {(field) => (
                <field.TextField label="Proposed household rules" area />
              )}
            </form.AppField>
            <Feedback {...action.feedback} />
            <form.AppForm>
              <form.Submit>Propose new revision</form.Submit>
            </form.AppForm>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Material changes do not inherit old approvals.
        </p>
      </CardFooter>
    </Card>
  );
}
