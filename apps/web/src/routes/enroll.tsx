import { createFileRoute } from "@tanstack/react-router";
import { Enrollment } from "@/features/account/enrollment";
export const Route = createFileRoute("/enroll")({ component: Enrollment });
