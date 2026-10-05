# Astra integration plan: adversarial review

Date: 2026-09-29. Scope: architecture and execution plan, not runtime qualification.

The independent `astra_plan_adversarial` subagent reviewed the draft against the
current Bedrock and Astra sources. Its workspace was an isolated detached Bedrock
worktree; it inspected current dirty sources read-only because HEAD alone did not
represent the proposed integration baseline. It made no edits, installed no packages
and ran no builds, tests or browsers.

## Findings and dispositions

### P1 — Browser-runner preflight occurred too late

Evidence: [Vitest configuration](../../../vite.config.ts) enables Playwright's
browser provider with headless Chromium; [Playwright configuration](../../../playwright.config.ts)
also uses the regular runner. The unit command therefore includes browser execution,
not only Node tests. The original draft required the full baseline suite in Phase 1
but postponed resolving the shared-browser contract until Phase 6.

Failure: baseline execution could launch a separate browser before the plan checked
the environment constraint.

Disposition: accepted and corrected. Phase 1 now requires runner preflight before
any browser baseline, covers both Vitest client and E2E execution, permits Node-only
tests independently, and keeps unsupported browser gates blocked. Manual smoke
testing cannot silently replace the automated acceptance evidence.

### P2 — Bedrock's dirty baseline was not recoverable

Evidence: the original Phase 1 recorded only Bedrock HEAD and dirty filenames, while
promising reproducible measurements and a baseline patch for rollback. Ongoing
changes include [DocsSidebar](../../../src/lib/site/DocsSidebar.svelte), a motion
consumer that affects the proposed shell baseline.

Failure: subsequent edits could invalidate measured behavior and bundle results;
HEAD and a file list cannot reconstruct uncommitted contents.

Disposition: accepted and corrected. Capture separate staged/unstaged patches,
necessary untracked sources and hashes before measuring. Tie evidence to the
snapshot. Rollback selectively reverses integration changes after inspecting the
current diff and never overwrites subsequent user work with the old snapshot.

### P2 — Performance acceptance was subjective

Evidence: the original component gate compared bytes and traces but allowed rejection
only if cost was described as unacceptable. No numerical limits or method defined
that decision.

Failure: a functional migration could substantially increase initial JavaScript or
interaction work while technically satisfying the requirement to record numbers.

Disposition: accepted and corrected. Phase 1 must establish numerical initial and
incremental gzip budgets plus interaction frame-gap/long-task limits from reproducible
production baselines before implementing component migrations. Fixtures, browser,
viewport, throttling, repetitions and warm/cold conditions must be recorded.
First-engine loading is measured separately. Missing budgets block implementation;
exceedances block adoption unless optimized or justified in a separately reviewed
budget revision. Numeric values remain a measured Phase 1 deliverable.

## Conclusion and verification scope

The reviewer found the architectural direction sound and stated that the plan would
be ready after correcting the two remaining findings; the browser prerequisite had
already been corrected during review. All three dispositions are now in the
[revised plan](plan.md).

The parent also added explicit OS-respecting policy for Phase 2 examples, preservation
of behavioral assertions when old wrappers are removed, and a policy coverage ledger
for retained legacy/third-party motion.

This review validates the plan's reasoning and sequencing. It does not establish
package compatibility, passing runtime tests, browser correctness or performance.
Those are implementation gates in the plan. Documentation validation checks formatting,
local links and diff whitespace; no runtime source was changed for this planning task.
