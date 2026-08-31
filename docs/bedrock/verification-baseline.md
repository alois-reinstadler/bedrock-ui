# Bedrock verification baseline

> **Status:** M0 baseline stabilized  
> **Captured:** 2026-08-30; stabilized 2026-08-30  
> **Checkpoint:** Motion source and demo state present before the documentation pass

## Purpose

This document records the evidence behind the M0 green-baseline work. The initial inventory found
100 check errors across 41 files. The stabilization pass resolved the shared root causes without
excluding files or weakening checks; the type-check, unit, build and browser end-to-end commands
now pass.

The previously reported cached shared-attachment type error in `/demo/ui` is **not reproducible**
in this checkpoint. `pnpm check` reports no diagnostics in `src/routes/demo/ui/**` or
`src/lib/bedrock/motion/**`. If that error returns, record the exact revision and diagnostic rather
than carrying it forward as an assumed failure.

## Commands and results

| Command                                                                                                 | Exit | Result                                                                                                          |
| ------------------------------------------------------------------------------------------------------- | ---: | --------------------------------------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile`                                                                        |    0 | Restored 347 packages in the isolated inventory worktree; the lockfile did not change.                          |
| `pnpm check`                                                                                            |    0 | Svelte Check reports 0 errors and 0 warnings.                                                                   |
| `pnpm run test:unit -- --run`                                                                           |    0 | Four Vitest files and 30 tests passed, including the browser project.                                           |
| `pnpm exec vitest run src/lib/bedrock/motion/layout-math.test.ts src/lib/bedrock/motion/tokens.test.ts` |    0 | 28 tests passed: 24 layout-math tests and 4 Astryx-aligned motion-token tests.                                  |
| `pnpm run test:e2e`                                                                                     |    0 | The production build completed and one Playwright Chromium end-to-end test passed against the isolated preview. |
| `pnpm test`                                                                                             |    0 | The pnpm-only aggregate completed the 30 Vitest tests and one Playwright end-to-end test.                       |
| Manual Chrome verification                                                                              |    0 | `/demo/ui`, the home fixture and installation docs loaded without console errors or failed network requests.    |

The aggregate script and Playwright web-server command now use pnpm. The end-to-end project installs
only its required Chromium browser and runs on an explicit, isolated loopback preview port with a
configured `baseURL`.

### Browser-preview status

The shared T3 preview automation host remained unavailable. The configured tailnet preview
allocation succeeded (`bedrock-ui-main`, port 4009), but its configured hostname did not resolve
from the environment. This is still a preview-infrastructure issue, not an application failure.

For verification only, the built application ran on `127.0.0.1:4174` and was exercised in the
shared headed Chrome. `/demo/ui` rendered all fourteen scenes; an interrupted layout animation
settled on the latest state with zero active animations and no residual inline transforms. The
home compatibility façades propagated tab, switch and checkbox state. The installation page
rendered its embedded Svelte example. Console inspection found no errors, warnings or issues, and
all inspected requests returned 200. The temporary tab and preview process were closed afterward.

This manual evidence closes the M0 application/browser baseline. It does not replace the dedicated
M1 browser-component cases for reduced motion, shared transfer, scrolling, presence and
performance.

## Resolved `pnpm check` failure inventory

| Diagnostic family                      |   Count | Area                                        | Root cause                                                                                                                                                             |
| -------------------------------------- | ------: | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unresolved `#lib/bedrock/ui/*` imports |      71 | Bedrock documentation/site components       | General `#lib` alias resolution is absent from `vite.config.ts`; the package import-map directory target does not resolve these Svelte index modules for Svelte Check. |
| Unresolved `#lib/site/*` imports       |       8 | Documentation site                          | Same alias/import-resolution boundary.                                                                                                                                 |
| Implicit-any cascades                  |       9 | Documentation site                          | Seven snippet bindings and two callbacks lose imported types after the module-resolution failures.                                                                     |
| Typed `resolve()` mismatches           |       6 | SvelteKit routes/site navigation            | Unconstrained strings and interpolated paths do not satisfy generated route types.                                                                                     |
| Installation-page parse cascade        |       6 | `src/routes/docs/installation/+page.svelte` | A literal `</script>` in an inline Svelte example terminates the containing script during parsing.                                                                     |
| **Total**                              | **100** |                                             |                                                                                                                                                                        |

Representative diagnostics occur in:

- `src/lib/site/CodeBlock.svelte` and `src/lib/site/HeroPlayground.svelte` for unresolved Bedrock
  UI imports;
- `src/routes/+page.svelte` for an unresolved `#lib/site/registry` import;
- `src/lib/site/DocsSidebar.svelte` for downstream snippet typing and typed-route failures;
- `src/routes/docs/installation/+page.svelte` for the embedded-script parse cascade.

## Stabilization changes

1. Added explicit package subpath imports for Bedrock UI and site modules so Vite, SvelteKit and
   TypeScript resolve the same public paths.
2. Encoded the installation-page sample without a literal closing script tag in the containing
   Svelte script.
3. Replaced unconstrained `resolve()` calls with generated route literals and parameter objects.
4. Corrected bindable values in the generated compatibility façades surfaced after import
   resolution was restored.
5. Replaced `npm run` calls with pnpm, configured Playwright's `baseURL` and isolated preview port,
   and provisioned the required Chromium executable.
6. Re-ran the type, unit, motion-specific, build, end-to-end and aggregate commands and performed a
   shared-Chrome console/network pass.

## M0 exit checklist

- [x] Current failures are counted and grouped by root cause.
- [x] Motion and `/demo/ui` diagnostics are separated from project-wide failures.
- [x] Motion math and token tests pass.
- [x] Import resolution is corrected and downstream diagnostics are re-inventoried.
- [x] The installation-page parser failure is corrected.
- [x] Typed routes pass checking.
- [x] Test scripts comply with the pnpm-only contract.
- [x] Playwright Chromium is provisioned and the browser project passes.
- [x] `pnpm check` exits 0.
- [x] All current tests exit 0.
