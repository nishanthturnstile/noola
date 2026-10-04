import { createFileRoute } from "@tanstack/react-router";
import { SignIn } from "@/features/account/sign-in";
export const Route = createFileRoute("/sign-in")({
  // Clearing an offline device must never fetch a new route chunk.
  codeSplitGroupings: [],
  component: SignIn,
});
