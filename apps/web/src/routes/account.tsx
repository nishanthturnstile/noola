import { createFileRoute } from "@tanstack/react-router";
import { Account } from "@/features/account/account";
import { accountSearch } from "@/lib/account-navigation";
export const Route = createFileRoute("/account")({
  validateSearch: accountSearch,
  component: Account,
});
