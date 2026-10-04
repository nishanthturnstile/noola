# ADR-013: Accessible UI foundation and styling

**Status:** Accepted — owner-selected frontend libraries only; full architecture approval remains pending.

**Validation:** Pending; accessible composition, device performance and library integration must be exercised.

**Provenance:** Nishanth explicitly selected TanStack Router, shadcn/ui with Base UI, TanStack Form and nuqs on 4 October 2026. This revises the 3 October proposed React Aria/Router-form approach. Current official sources are linked in the [frontend review](../reviews/TANSTACK-AND-UI-REVIEW.md).

## Context

Core workflows must work on phones and desktop without voice or sound, with keyboard/screen-reader access and enlarged text. The product needs visible audience, evidence, approval and outcome controls rather than a generic chat shell.

<a id="decision"></a>
## Decision

Use shadcn/ui's Base UI variant with `@base-ui/react`, Tailwind CSS 4, owned semantic CSS tokens and named Lucide imports. At setup select Base UI explicitly, commit `components.json` and only needed generated components, and record the generator version/preset. Follow current Base UI APIs and base-scoped examples. Native elements remain appropriate for simple content. Use CSS transitions with reduced-motion support.

Use TanStack Router for routing, TanStack Form for editable forms and nuqs for approved nonsensitive URL presentation state. TanStack Query is the recommended remote-data owner. React state/reducers and narrow context cover ephemeral interactions. Share typed fields and repeated patterns inside the web app; introduce a shared UI package when another compatible client consumes it.

nuqs means the React URL-state library, not the Nuxt framework. Its Router integration requires an adoption check. URL state never grants record authority. Sensitive content and private search text remain out of URLs under the existing frontend privacy contract.

## Alternatives

React Aria and shadcn/Radix are alternative primitive foundations; they are not selected. React Hook Form, Formisch, Redux/Zustand and custom query caching duplicate chosen state responsibilities. TanStack Store is conditional on shared client-only state. The full TanStack catalog is evaluated in the frontend review; library membership does not justify installation.

## Consequences

Generated shadcn code is owned source requiring review and deliberate updates. Inspect registry dependencies before adding components so examples do not silently introduce Radix, React Aria or another form library. Compose product audience, evidence, consent and approval controls from the shared foundation. Typed form schemas do not replace backend permission/revision checks. Query caching, route preloads, drafts and URL state need coordinated identity/lock clearing.

Test labels, error announcements, focus restoration, touch, keyboard, screen readers, enlarged text and reduced motion. Accessible primitives alone do not establish accessible product behavior. Add optional libraries only for observed needs and with maturity/compatibility checks; measure actual phone responsiveness.

## Reconsideration trigger

A missing required control, failed device/accessibility gate or confirmed integration defect can trigger a reviewed adaptation. Changing an owner-selected foundation requires an explicit decision; an experimental adapter does not authorize silently switching libraries.

## Requirements and evidence

[Frontend integration](../reference/APPLICATION-DESIGN.md#frontend-integration), FR-003/FR-008, QLT-10, [G01/G10/G13](../reference/DECISIONS-AND-GATES.md#evidence-gates).
