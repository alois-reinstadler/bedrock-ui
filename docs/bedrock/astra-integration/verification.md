> Historical report: the legacy engine and optional-integration architecture have
> been superseded by the CSS-first Astra migration. See [current contract](../motion.md).

# Astra Motion integration verification

## Architecture and preserved work

Integration branch: `integration/astra-motion`, based on completed site expansion
`b4f7be2`. Both prerequisite threads were inspected: Bedrock UI Site Expansion
(`b4cfc0d7-6790-4299-8a7c-961092af26cc`) and Evaluate CSS Motion Alternatives
(`64e2c9f6-9d06-4f23-ab2a-8885067eb328`). Their completed reports were checked against
repository status and diffs, rather than treated as a clean commit boundary.

Bedrock's existing dirty package, lockfile, generated component reference, wrappers,
comparison and vendor archive were preserved in prerequisite commit `883a56d`.
The original tracked patch and untracked archive were also backed up outside the
repository before editing. Astra's dirty upstream work was inspected without
modification. Existing worktrees and the main branch were left intact. Dedicated
worker worktrees were used for documentation and tests and removed after review
and cherry-pick.

Astra remains a separately maintained dependency. No runtime source was copied
into Bedrock. The archive's provenance includes its dirty upstream source state;
its base commit alone is insufficient to reconstruct the completed CSS backend.
The archive and installed content match; an independent upstream audit reproduced
all 29 published TypeScript runtime files from source. The package metadata and
SHA-256 are recorded in [the provenance manifest](../../../vendor/astra-motion.json).

The existing Bedrock motion entry retains its signatures, millisecond timings,
layout ownership and OS preference behavior. New explicit CSS, engine, configuration,
projection, scroll and value entries expose Astra's supported APIs. Astra timings
use seconds. Route adapters are excluded because Astra declares Kit 2 support
and this application uses Kit 3. Shared Astra policy does not silently change
existing Bedrock transitions.

CssButton preserves Button styling, native button/link behavior, consumer
attachments, event handlers, styles and disabled state. Its ref now binds through
both wrapper layers. CssPanel owns its element and global Svelte transition,
forwards a bindable ref with cleanup, and defaults to visible SSR content.
Explicit entrance styles remain supported. The existing Button ref bridge was
repaired without modifying the frozen shadcn implementation.

## Review findings addressed

- Added archive hash, export-target, installed runtime and semantic manifest checks.
- Bundled all seven integration entry points. CSS, config and legacy bundles must
  contain no rendered Motion runtime modules or route adapter code.
- Added SSR, native keyboard/link, disabled, ref, attachment/style/event forwarding,
  provider, OS preference, retained/reversed exit and engine interaction checks.
- Reduced motion preserves target geometry while removing interpolation; tests
  explicitly distinguish this from resetting the target to zero.
- The new guide's syntax-highlighted comments initially measured 4.43:1 on a muted
  background. Its code blocks now use the page background to meet contrast requirements.
- Reviewed generated-reference changes against the prerequisite Svelte upgrade;
  subsequent generation produces no additional diff. Test-written expansion
  screenshots are restored; build output and temporary logs remain untracked/ignored.

## Verification results

- Upstream Astra: 23 server test files, **120 tests passed**, independently rerun.
- Bedrock `pnpm run test:unit -- --run`: **65 files, 355 tests passed** in 24.63 seconds.
  After the final ref cleanup adjustment, the affected SSR/browser wrapper tests
  were rerun: **2 files, 9 tests passed**.
- `pnpm check`: **zero errors and zero warnings**, including integrated docs and tests.
- `pnpm build`: **passed**, static prerender complete. Existing adapter and chunk-size
  notices remain; thresholds were not increased.
- `pnpm motion:verify`: **passed**; 71 archive entries verified, installed manifest and
  content match, all seven public integration entry points bundle successfully.
  CSS/config/legacy contain no rendered Motion runtime modules.
- Frozen-lockfile offline install: **passed** using this checkout's existing
  `/home/node/repos/.pnpm-store`; no lockfile changes.
- Final production Playwright run: **179 tests passed in 1.6 minutes**, covering all
  component catalogue pages, docs navigation/rendering, templates, Stepped Form,
  both legacy motion labs including 50/100-node metrics, and nine Astra integration
  checks. New pages have no serious/critical axe findings in light or dark mode.
- Changed-file Prettier, ESLint, `git diff --check`, and Svelte MCP autofixer: **passed**.
- Shared Chrome manual verification: guide search, breadcrumbs, pointer/Enter/Space
  activation, reduced-motion target settlement (32px, no active animations), mobile
  guide/comparison layout, dark mode, screenshots, console and resource checks passed.
  Owned browser tabs were closed.

Raw execution logs and browser screenshots are retained at
`/tmp/bedrock-astra-baseline/` for this session. The final persistent production preview
is available at `http://100.64.0.2:4086/docs/motion` and `/motion`; browser tools use
`http://127.0.0.1:4086`. A container restart requires restarting the managed preview.

## Known boundaries

The repository-wide formatting baseline has 399 failures, all outside the integration
changed-file set. Full ESLint also exposes an existing unused `_payload` parameter
in `src/lib/shadcn/ui/chart/chart-tooltip.svelte`; frozen upstream UI was not reformatted.
Changed files must pass formatting and ESLint.

Astra's upstream license is unspecified. This integration does not grant a license
or publish either package. Firefox/WebKit and Astra's Kit 3 route adapter remain
unqualified. The CSS backend intentionally rejects physics, projection and other
unsupported options; documented separate engine imports cover those capabilities.

During verification a running Vite preview held the previous build's asset manifest.
The managed preview was restarted after rebuilding and affected tests were rerun.
A direct Vitest invocation without the project's `NODE_ENV=test` also failed
existing development-diagnostic assertions; the required package script passed.
The initial offline install used the container-global pnpm store, which differs
from this checkout's existing store. Retrying with that existing store succeeded
without purging dependencies or rewriting the lockfile.
