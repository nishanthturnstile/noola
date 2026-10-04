import { createFileRoute } from "@tanstack/react-router";
import { RecoveryGuide } from "@/features/account/recovery";
export const Route = createFileRoute("/recovery")({ component: RecoveryGuide });
