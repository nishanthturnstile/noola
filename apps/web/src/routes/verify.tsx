import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmail } from "@/features/account/recovery";
export const Route = createFileRoute("/verify")({ component: VerifyEmail });
