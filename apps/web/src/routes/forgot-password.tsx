import { createFileRoute } from "@tanstack/react-router";
import { ForgotPassword } from "@/features/account/recovery";
export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
});
