import { expect, it } from "vitest";
import { inspectToolRequest } from "./tool-probe.js";

it("accepts an omitted or empty tool list but fails any exposed tool", () => {
  expect(inspectToolRequest({ input: [] }).noTools).toBe(true);
  expect(inspectToolRequest({ tools: [], input: [] }).noTools).toBe(true);
  expect(
    inspectToolRequest({ tools: [{ name: "exec_command" }], input: [] })
      .noTools,
  ).toBe(false);
  expect(() => inspectToolRequest({ tools: null, input: [] })).toThrow();
  expect(() => inspectToolRequest({ tools: [] })).toThrow();
});

it("requires explicit tool result records, not model prose about rejection", () => {
  expect(
    inspectToolRequest({
      input: [{ type: "message", output: "unsupported call: exec_command" }],
    }).rejectedCalls,
  ).toEqual([]);
  expect(
    inspectToolRequest({
      input: [
        {
          type: "custom_tool_call_output",
          call_id: "synthetic-patch",
          output: "unsupported call: apply_patch",
        },
      ],
    }).rejectedCalls,
  ).toHaveLength(1);
});
