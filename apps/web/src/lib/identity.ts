import { createIdentityClient, IdentityApiError } from "@noola/api-client";

let authorityActive = false;
export function setClientAuthority(value: boolean) {
  authorityActive = value;
}
let generation = 0;
let abort = new AbortController();
export function discardPrivateRequests() {
  authorityActive = false;
  generation++;
  abort.abort();
  abort = new AbortController();
}
export const identityClient = createIdentityClient("", async (input, init) => {
  const started = generation;
  const response = await fetch(input, {
    ...init,
    signal: AbortSignal.any([
      abort.signal,
      ...(init?.signal ? [init.signal] : []),
    ]),
  });
  const isAuth = String(input).includes("/api/auth/");
  if (authorityActive && !isAuth && [401, 423].includes(response.status))
    window.dispatchEvent(
      new CustomEvent("noola-clear", {
        detail: {
          reason: response.status === 423 ? "locked" : "signed-out",
          broadcast: true,
        },
      }),
    );
  if (started !== generation)
    throw new DOMException("Identity changed", "AbortError");
  // Read the complete response before releasing it; a late body cannot refill a disposed cache.
  const body = await response.arrayBuffer();
  if (started !== generation)
    throw new DOMException("Identity changed", "AbortError");
  return new Response(body, {
    status: response.status,
    headers: response.headers,
  });
});
export { IdentityApiError };
