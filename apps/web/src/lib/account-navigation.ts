import type { StandardSchemaV1 } from "@standard-schema/spec";
import { createStandardSchemaV1, parseAsStringLiteral } from "nuqs";
export const accountPanels = [
  "setup",
  "household",
  "devices",
  "dependent",
  "aliases",
] as const;
export const accountParsers = {
  panel: parseAsStringLiteral(accountPanels)
    .withDefault("setup")
    .withOptions({ history: "push" }),
};
export const accountSearch: StandardSchemaV1<
  unknown,
  { panel?: (typeof accountPanels)[number] }
> = createStandardSchemaV1(accountParsers, {
  partialOutput: true,
});
