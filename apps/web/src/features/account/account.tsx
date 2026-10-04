import type { CurrentAdult } from "@noola/contracts/identity";
import { useQueryState } from "nuqs";
import { Button } from "@/components/ui/button";
import { RelationshipAliases } from "@/features/household/aliases";
import { DependentSetup } from "@/features/household/dependent";
import { HouseholdSetup } from "@/features/household/household";
import { accountPanels, accountParsers } from "@/lib/account-navigation";
import { Devices } from "./devices";
import { PrivateBoundary } from "./private-boundary";
import { AccountSetup } from "./setup";
import { AccountShell } from "./shell";
export function Account() {
  return (
    <PrivateBoundary>
      {(adult) => <AccountContent adult={adult} />}
    </PrivateBoundary>
  );
}
function AccountContent({ adult }: { adult: CurrentAdult }) {
  const [panel, setPanel] = useQueryState("panel", accountParsers.panel);
  const labels = {
    setup: "Your setup",
    household: "Household rules",
    devices: "Devices & security",
    dependent: "Dependent profile",
    aliases: "Relationship aliases",
  };
  return (
    <AccountShell adult={adult}>
      <div className="flex flex-col gap-8">
        <nav aria-label="Account navigation" className="flex flex-wrap gap-2">
          {accountPanels.map((name) => (
            <Button
              key={name}
              variant={panel === name ? "default" : "outline"}
              aria-current={panel === name ? "page" : undefined}
              onClick={() => void setPanel(name)}
            >
              {labels[name]}
            </Button>
          ))}
        </nav>
        {panel === "setup" ? (
          <AccountSetup key={adult.settings.revision} adult={adult} />
        ) : panel === "household" ? (
          <HouseholdSetup adult={adult} />
        ) : panel === "devices" ? (
          <Devices adult={adult} />
        ) : panel === "dependent" ? (
          <DependentSetup adult={adult} />
        ) : (
          <RelationshipAliases />
        )}
      </div>
    </AccountShell>
  );
}
