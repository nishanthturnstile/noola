import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { LoaderCircle } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();
function errors(values: unknown[]) {
  return values.map((value) => ({
    message:
      typeof value === "string"
        ? value
        : typeof value === "object" && value !== null && "message" in value
          ? String(value.message)
          : "Check this field.",
  }));
}
function TextField({
  label,
  hint,
  type = "text",
  autoComplete,
  area = false,
}: {
  label: string;
  hint?: string;
  type?: string;
  autoComplete?: string;
  area?: boolean;
}) {
  const field = useFieldContext<string>();
  const controlId = useId();
  const invalid = field.state.meta.errors.length > 0;
  const control = {
    id: controlId,
    name: field.name,
    value: field.state.value,
    onBlur: field.handleBlur,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      field.handleChange(e.target.value),
    "aria-invalid": invalid,
    "aria-describedby":
      [hint && `${controlId}-hint`, invalid && `${controlId}-error`]
        .filter(Boolean)
        .join(" ") || undefined,
  };
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={controlId}>{label}</FieldLabel>
      {area ? (
        <Textarea {...control} />
      ) : (
        <Input {...control} type={type} autoComplete={autoComplete} />
      )}{" "}
      {hint && (
        <FieldDescription id={`${controlId}-hint`}>{hint}</FieldDescription>
      )}
      <FieldError
        id={`${controlId}-error`}
        errors={errors(field.state.meta.errors)}
      />
    </Field>
  );
}
function SelectField({
  label,
  options,
}: {
  label: string;
  options: ReadonlyArray<{ value: string; label: string }>;
}) {
  const field = useFieldContext<string>();
  const controlId = useId();
  const invalid = field.state.meta.errors.length > 0;
  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={controlId}>{label}</FieldLabel>
      <NativeSelect
        id={controlId}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${controlId}-error` : undefined}
        className="w-full"
      >
        {options.map((option) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <FieldError
        id={`${controlId}-error`}
        errors={errors(field.state.meta.errors)}
      />
    </Field>
  );
}
function CheckField({ label, hint }: { label: string; hint?: string }) {
  const field = useFieldContext<boolean>();
  const controlId = useId();
  const invalid = field.state.meta.errors.length > 0;
  return (
    <Field orientation="horizontal" data-invalid={invalid}>
      <Checkbox
        id={controlId}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={field.handleChange}
        onBlur={field.handleBlur}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${controlId}-error` : undefined}
      />
      <div className="flex flex-col gap-1">
        <FieldLabel htmlFor={controlId}>{label}</FieldLabel>
        {hint && <FieldDescription>{hint}</FieldDescription>}
        <FieldError
          id={`${controlId}-error`}
          errors={errors(field.state.meta.errors)}
        />
      </div>
    </Field>
  );
}
function Submit({ children }: { children: React.ReactNode }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(pending) => <SubmitControl pending={pending}>{children}</SubmitControl>}
    </form.Subscribe>
  );
}
function SubmitControl({
  pending,
  children,
}: {
  pending: boolean;
  children: React.ReactNode;
}) {
  const button = useRef<HTMLButtonElement>(null);
  const wasPending = useRef(false);
  useEffect(() => {
    if (wasPending.current && !pending)
      button.current?.form
        ?.querySelector<HTMLElement>('[aria-invalid="true"]')
        ?.focus();
    wasPending.current = pending;
  }, [pending]);
  return (
    <Button ref={button} type="submit" disabled={pending}>
      {pending && (
        <LoaderCircle
          data-icon="inline-start"
          className="motion-safe:animate-spin"
        />
      )}
      {pending ? "Working…" : children}
    </Button>
  );
}
export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { TextField, SelectField, CheckField },
  formComponents: { Submit },
});
