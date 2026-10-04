import { createApiClient } from "@noola/api-client";
import { queryOptions } from "@tanstack/react-query";

const api = createApiClient();
export const readinessOptions = queryOptions({
  queryKey: ["health", "ready"],
  queryFn: ({ signal }) => api.readiness(signal),
  retry: false,
  staleTime: 10000,
  refetchOnWindowFocus: false,
});
