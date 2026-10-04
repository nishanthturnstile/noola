import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
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
import { useAction, useRequestIdentity } from "@/features/account/use-action";
import { identityClient } from "@/lib/identity";
export function RelationshipAliases() {
  const query = useQueryClient();
  const action = useAction();
  const requestIdentity = useRequestIdentity();
  const [resolution, setResolution] = useState("");
  const aliases = useQuery({
    queryKey: ["identity", "aliases"],
    queryFn: ({ signal }) => identityClient.call("aliases", signal),
  });
  const household = useQuery({
    queryKey: ["identity", "household"],
    queryFn: ({ signal }) => identityClient.call("household", signal),
  });
  const form = useAppForm({
    defaultValues: { phrase: "", name: "", target: "person" },
    onSubmit: async ({ value }) => {
      if (
        await action.run(() =>
          requestIdentity(
            {
              action: "save",
              phrase: value.phrase,
              name: value.name,
              targetType: value.target === "person" ? "person" : "adult",
              ...(value.target === "person" ? {} : { targetId: value.target }),
            },
            (requestId, input) =>
              identityClient.call("aliasCommand", { ...input, requestId }),
          ),
        )
      ) {
        form.reset();
        await query.invalidateQueries({ queryKey: ["identity", "aliases"] });
      }
    },
  });
  const resolver = useAppForm({
    defaultValues: { phrase: "" },
    onSubmit: async ({ value }) => {
      await action.run(async () => {
        const result = await identityClient.call("aliasCommand", {
          action: "resolve",
          phrase: value.phrase,
        });
        setResolution(
          result.status === "unresolved"
            ? "No confirmed mapping. Ask for clarification."
            : result.status === "clarification"
              ? `Please clarify: ${result.candidates?.map((c) => c.name).join(" or ")}.`
              : `Resolved reference: ${result.candidates?.[0]?.name}. This grants no record access.`,
        );
      }, "Reference checked.");
    },
  });
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-medium">Your relationship references</h1>
      <p className="text-muted-foreground">
        Mappings belong to you. The same phrase may mean someone different for
        the other adult.
      </p>
      <div className="grid items-start gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Confirm a mapping</CardTitle>
            <CardDescription>
              For example, “my wife” or “Mom.” Named people do not get accounts.
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
                <form.AppField name="phrase">
                  {(field) => <field.TextField label="Your phrase" />}
                </form.AppField>
                <form.AppField name="name">
                  {(field) => <field.TextField label="Person’s display name" />}
                </form.AppField>
                <form.AppField name="target">
                  {(field) => (
                    <field.SelectField
                      label="Reference target"
                      options={[
                        {
                          value: "person",
                          label: "Private named person (no account)",
                        },
                        ...(household.data?.members.map((m) => ({
                          value: m.id,
                          label: m.name,
                        })) ?? []),
                      ]}
                    />
                  )}
                </form.AppField>
                <form.AppForm>
                  <form.Submit>Save my mapping</form.Submit>
                </form.AppForm>
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              A reference never grants access to another person’s records.
            </p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resolve a reference</CardTitle>
            <CardDescription>
              Ambiguous names require clarification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void resolver.handleSubmit();
              }}
            >
              <FieldGroup>
                <resolver.AppField name="phrase">
                  {(field) => <field.TextField label="Phrase to resolve" />}
                </resolver.AppField>
                <resolver.AppForm>
                  <resolver.Submit>Check reference</resolver.Submit>
                </resolver.AppForm>
                {resolution && <p role="status">{resolution}</p>}
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Only permitted candidates appear.
            </p>
          </CardFooter>
        </Card>
      </div>
      <Feedback {...action.feedback} />
      <ul className="flex flex-col gap-3">
        {aliases.data?.map((alias) => (
          <li
            key={alias.id}
            className="flex flex-wrap items-center justify-between gap-3"
          >
            <span>
              {alias.phrase} → {alias.name}
            </span>
            <Button
              variant="outline"
              disabled={action.pending}
              onClick={() =>
                void action
                  .run(() =>
                    identityClient.call("aliasCommand", {
                      action: "delete",
                      aliasId: alias.id,
                    }),
                  )
                  .then((ok) => {
                    if (ok)
                      void query.invalidateQueries({
                        queryKey: ["identity", "aliases"],
                      });
                  })
              }
            >
              Remove mapping
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
