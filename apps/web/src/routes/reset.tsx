import { createFileRoute } from "@tanstack/react-router";
import { ResetPassword } from "@/features/account/recovery";
export const Route = createFileRoute("/reset")({ component: ResetPassword });
