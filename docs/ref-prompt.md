**Use three prompts in the same chat: research and plan → implement → validate.** Replace `[CHANGE]` with a feature, bug fix, or phase from your plan.

Start with this:

```text
Investigate and plan [CHANGE]. Keep this step to research and planning.

Read the repository instructions, relevant documentation, code, tests,
and configuration. Establish what is already implemented, partially
implemented, missing, or unverified, citing concrete evidence.

Research technical uncertainties using current primary sources where
needed. Check compatibility before proposing dependencies or APIs.
Follow the project's existing architecture and tooling.

Produce a practical implementation plan covering:
- The intended outcome and scope.
- Existing behavior and required changes.
- Dependencies, affected components, and implementation order.
- Observable success criteria, including relevant failure cases.
- How each criterion will be validated: automated tests, integration
  checks, builds, manual checks, and UI/browser checks where applicable.
- Assumptions, unresolved decisions, and genuine blockers.

If the request covers a large phase, divide it into manageable increments
and identify the first complete outcome to implement.

Scale the detail to the complexity. End with the plan and any questions
whose answers materially affect it.
```

After reviewing the plan, use this:

```text
Implement the agreed plan for [CHANGE].

Recheck the relevant code and follow repository instructions and existing
conventions. Preserve unrelated changes and keep the implementation
within the agreed scope.

Implement the complete behavior, including applicable permissions,
failure handling, and user controls. Add focused tests for meaningful
behavior and regressions. Update affected documentation.

Run the relevant checks and fix failures. If new evidence changes the
plan, explain the adjustment; ask only when missing information or a
material scope decision genuinely blocks progress.

Continue until the agreed implementation is complete. Report what
changed, what was verified, and anything still unresolved or unverified.
```

Finish with this:

```text
Review and validate the implementation against the agreed plan.

Inspect the actual changes and check every success criterion. Review
correctness, regressions, failure behavior, and any relevant security,
privacy, accessibility, or performance concerns.

Use existing check results when they are current. Run missing checks,
and repeat checks when changes or unresolved concerns justify it.

For UI changes, run the application and exercise the affected flows in
a browser where available. Check relevant screen sizes, interactions,
keyboard access, and loading, empty, success, and error states.
For other changes, validate the relevant API, database, job, or command
behavior through execution.

Fix issues within the agreed scope and revalidate affected behavior.

Report each success criterion as Passed, Failed, or Not verified, with
supporting evidence. Clearly identify checks requiring unavailable
devices, credentials, services, or human judgment.

Conclude with the implementation's readiness and any remaining work.
```

For a small change, the plan can be a few bullets. For a substantial feature, save the agreed plan in the repository so later chats can resume from it. Keep each implementation focused on one complete, verifiable outcome.