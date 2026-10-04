import { z } from "zod";
export const liveSchema = z.strictObject({ status: z.literal("ok") });
export const readySchema = z.strictObject({ status: z.literal("ready") });
export const unavailableSchema = z.strictObject({
  status: z.literal("unavailable"),
});
