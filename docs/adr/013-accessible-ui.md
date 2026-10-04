# ADR-013: Accessible UI foundation and styling

**Status:** Proposed.

**Validation:** Pending; see the linked gates.

**Provenance:** Extracted from the supplied product, architecture and stack baseline dated 3 October 2026. No original D-series record was available. External observations were not revalidated during consolidation.

## Context

Core workflows must work on phones and desktop without voice or sound, with keyboard/screen-reader access and enlarged text. The product needs visible audience, evidence, approval and outcome controls rather than a generic chat shell.

<a id="decision"></a>
## Decision

Use React Aria Components for complex interaction behavior and native elements for simple content. Tailwind CSS and application-owned CSS tokens supply layout, focus, theme and readable styling. Use Lucide named imports with meaningful labels. React/Router state, loaders/actions/fetchers and ordinary controls are the initial form/state approach. Use CSS transitions with reduced-motion support; no separate animation dependency.

## Alternatives

shadcn with Radix/Base UI offers fast copied composition; native HTML alone is appropriate for simple content but leaves complex widget behavior to the application. React Aria supplies a maintained behavior foundation while the product owns composition. CSS Modules remain viable but introduce more local styling conventions. Multiple headless foundations, runtime styling, TanStack Query, Redux/Zustand, React Hook Form and rich editors have no demonstrated initial requirement.

## Consequences

The application must build its own audience selectors, source cards, approval flows, errors and confirmations. Installing accessible primitives does not prove accessible composition or phone behavior. Test focus, touch, keyboard, screen-reader and enlargement scenarios. Tailwind/browser floors are inherited research in the evidence reference, not a claim about household devices. Avoid an extra Tailwind plugin solely for shorthand when native data-state variants suffice.

## Reconsideration trigger

Reconsider an isolated tool only when a required control is missing or measured interaction/form/state maintenance justifies it. Evaluate actual accessibility and device evidence before replacing the foundation or adding a second one.

## Requirements and evidence

[Frontend integration](../reference/APPLICATION-DESIGN.md#frontend-integration), FR-003/FR-008, QLT-10, [G01/G10/G13](../reference/DECISIONS-AND-GATES.md#evidence-gates).
