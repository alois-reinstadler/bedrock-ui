# Astra integration baseline and fixed acceptance budgets

Captured 2026-09-29 before component migrations. These are desktop/emulated
measurements, not physical-device or cross-browser qualification.

## Recoverable source and environment

The external recovery directory is
`/workspace/agent-jobs/bedrock-astra-migration/bedrock-ui-baseline` with separate
staged/unstaged patches and `bedrock-ui-snapshot.json` in its parent directory.
The snapshot records HEAD `5a3d29d2d8c0d0ed720e5711d9e2c76d978ac4af` plus all
included source-file hashes. Snapshot-manifest SHA-256:
`bf7aa3acbc961012dda9e9dc0e7222f6e3347892bb9f5bf262af5f4fad408948`.
The old archive SHA-256 is
`b99f2f8d46b4e6c3c515ad97fa6b9ac730e2e556ce25b5a505b13b800dc14afe`.

Production build and browser traces used the pre-existing installed Vite 8.0.16
and Node 24.20.0. The committed lockfile resolves Vite 8.2.2; standalone and
shared-chunk budget evidence was subsequently rebuilt from an isolated frozen-lock
install with Vite 8.2.2, matching the candidate toolchain. Both are explicitly
identified; do not compare the original production build with a new build as if
the toolchain were unchanged. Runtime comparisons retain the same fixture pages,
Chrome version and interaction protocol.

The initial worktree dependency symlink caused generated `$app/tsconfig` rootDirs
to point at the main repository, producing 30 missing-generated-type errors.
A later diagnostic also followed the main candidate archive installation. Those
runs are invalid baseline type evidence. The symlink was removed locally and the
old archive installed from the baseline frozen lockfile; the isolated baseline
`pnpm check` then passed with **0 errors, 0 warnings**. No application workaround
or type weakening was introduced.

## Important-milestone checks

Full logs live in `/workspace/agent-jobs/bedrock-astra-migration/`.

| Check                                    | Result                    | Log                             |
| ---------------------------------------- | ------------------------- | ------------------------------- |
| Production build                         | Pass                      | `baseline-build.log`            |
| Isolated baseline typecheck              | 0 errors, 0 warnings      | `baseline-check-local-deps.log` |
| Existing package verifier                | Pass                      | `baseline-motion-verify.log`    |
| Focused motion Node suite                | 7 files, 50 tests pass    | `baseline-server-tests.log`     |
| Existing AsyncButton browser suite       | 7 tests pass, shared CDP  | `baseline-browser-tests.log`    |
| Motion-lab representative production E2E | 1 test passes, shared CDP | `baseline-e2e.log`              |

No whole-site E2E suite was run. Chrome remained reachable after both automated
runs, and every manually owned page/context was closed. Baseline AsyncButton and
AvatarStack production pages had no console warnings/errors or HTTP resource
responses >=400 during the measured interactions. Baseline screenshot:
`/workspace/agent-jobs/bedrock-astra-migration/baseline-async.png`.

## Browser-runner preflight

Vitest's exported Playwright provider is reused through a custom provider factory
in `scripts/shared-browser-provider.ts`. Before opening a page it receives a
`chromium.connectOverCDP` connection with `noDefaults: true`, so the shared default
context is not reconfigured. The provider creates and closes only its own test
contexts/pages. The E2E fixture `scripts/shared-browser-test.ts` overrides the
worker browser with the same attachment and lets normal Playwright fixtures own
isolated test contexts. There is no launch fallback.

For a connected browser, `Browser.close()` disconnects that client instead of
terminating Chrome; see [Playwright Browser.close](https://playwright.dev/docs/api/class-browser#browser-close)
and [CDP attachment](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp).
The default endpoint is `http://127.0.0.1:9222`, overridable with
`SHARED_BROWSER_CDP_URL` for an already-running compatible Chrome.

Only E2E files importing the shared fixture are qualified for this runner. Other
legacy `@playwright/test` imports still use Playwright's launching fixture and
must not be run under the shared-browser contract until migrated. Selected E2E
runs use one worker. The Vitest adapter was checked against Vitest 4.1.x and its
exported provider class; its public browser handle needs rechecking on upgrades.

The baseline managed production preview reused the **previously stopped**
`bedrock-motion-architecture-production` allocation: local
`http://127.0.0.1:4095`, user `http://100.64.0.2:4095`. New allocations were exhausted;
no running user preview was stopped. Final preview uses a separate allocation.

## Fixed browser protocol and budgets

Chrome 152.0.7977.82, 1280 x 900, DPR 1, CPU slowdown 1 (no throttling), normal
motion, warm page after loading and scrolling the control into view. Each run:
20 clicks spaced by 100 ms, followed by 1200 ms settling; 1600 ms rest between
runs. AsyncButton uses the first `data-slot="async-button"` on
`/docs/components/async-button` (1200 ms resolving action; repeated activations
are deliberately ignored while locked). AvatarStack uses `/demo/erp`, alternating
`Mitglied entfernen` and `Mitglied hinzufügen`. Three runs per component.

`requestAnimationFrame` timestamp differences measure frame gaps. A
`PerformanceObserver` records `longtask` entries only during each run. These are
whole-page interaction measurements, not isolated engine CPU attribution.
Raw summaries: [AsyncButton](async-baseline-frames.json),
[AvatarStack](avatar-baseline-frames.json).

| Metric                    | AsyncButton baseline  | AvatarStack baseline  | Fixed gate, every run              |
| ------------------------- | --------------------- | --------------------- | ---------------------------------- |
| Frame samples             | 193 / 194 / 192       | 192 / 191 / 192       | Same protocol, report actual count |
| p95 frame gap             | 16.8 / 16.7 / 16.7 ms | 16.8 / 16.8 / 16.8 ms | <=25.2 ms; <=1.5x worst baseline   |
| Maximum frame gap         | 16.8 / 16.8 / 33.4 ms | 16.8 / 16.8 / 16.8 ms | <=50 ms                            |
| Long-task count (>50 ms)  | 0 / 0 / 0             | 0 / 0 / 0             | 0; additive regression allowance 0 |
| Long-task total / maximum | 0 / 0 ms              | 0 / 0 ms              | 0 / 0 ms                           |

Ratios against a zero long-task baseline are undefined; the absolute no-regression
rule is explicit. New runs must also preserve immediate semantics, cleanup and
focus; satisfying a timing number does not waive behavior.

## Bundle method and fixed budgets

`node scripts/measure-motion-bundles.mjs <root> <output.json>` mounts fixed real
component consumers with production tree shaking. Run the script **inside each
measured checkout** to use that checkout's installed toolchain. The JSON records
Node/Vite, lockfile/archive hashes, rendered modules, engine identities and gzip
sizes. Evidence: [baseline bundles](baseline-bundles.json).

Standalone JS gzip baseline with locked Vite 8.2.2: Button **42232 B**, config
**11845 B**, retained legacy exports **34713 B**, AsyncButton **54144 B**,
AvatarStack **47934 B**. Button and legacy graphs contain zero Motion engines.

A second, genuine multi-entry build includes Button, AsyncButton, AvatarStack and
a stable engine reference retaining public `createMotion`, `createLayout` and
`presence`. Initial bytes sum each entry's static transitive chunk closure.
Engine-warm bytes exclude actual chunks already in the engine-reference closure;
no separately compressed totals are subtracted. The reference itself is
**63172 B gzip** in the baseline. This is a fixed public-engine composition,
not a promise that every possible Astra feature has been loaded.

| Consumer    | Shared initial baseline |    Fixed initial ceiling | Engine-warm baseline |      Fixed warm ceiling |
| ----------- | ----------------------: | -----------------------: | -------------------: | ----------------------: |
| AsyncButton |                 55304 B | 97608 B (+42304; 1.765x) |              35829 B | 41255 B (+5426; 1.152x) |
| AvatarStack |                 43302 B | 85606 B (+42304; 1.977x) |              23827 B | 28628 B (+4801; 1.202x) |

The first-use allowance is one baseline ordinary-control runtime equivalent:
**42304 B**, frozen from the original installed-toolchain Button measurement.
Warm allowances are 10% of the original standalone component measurements,
rounded up (**5426 B**, **4801 B**). These amounts were fixed and accepted before
component implementation; the isolated lockfile measurements do not raise them.
Ordinary Button must retain zero engine modules and stay within **1%** of the
locked standalone Button baseline (**42655 B gzip**). No React, duplicate engine
identity or route adapter is allowed in any ordinary component fixture.

Production route resource inventories are supplementary because their Vite
version differs. [Resource lists](baseline-route-resources.json) record loaded JS
requests after a full navigation and 600 ms settling; [route bytes](baseline-route-bytes.json)
sum gzip of the corresponding production files. They include route preload and
shared-shell costs, exclude CSS/assets, and are file-size estimates rather than
server transfer-size measurements.

| Route                           | Baseline JS gzip |
| ------------------------------- | ---------------: |
| `/docs/components/button`       |         223532 B |
| `/docs`                         |         183146 B |
| `/motion`                       |         180638 B |
| `/docs/components/async-button` |         226877 B |
| `/demo/erp` (AvatarStack)       |         307256 B |

Initial-route gzip delta must remain <=42304 B (the fixed first-use allowance):
relative ceilings are respectively 1.190x, 1.231x, 1.235x, 1.187x and 1.138x.
Interpret route changes alongside the locked-toolchain component graphs; clearly
identify toolchain drift. Any breached component gate blocks adoption pending
optimization, retention of the prior implementation, or a separately reviewed
budget change with a concrete rationale. Do not silently raise limits.
