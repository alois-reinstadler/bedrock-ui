# CSS-first Astra migration

The initial optional integration preserved a second animation engine. The followup
explicitly removes that boundary: Bedrock uses Astra CSS by default and imports
Astra JS only for physics, automatic layout projection, or reactive values.

## Architecture and compatibility

- `src/lib/bedrock/motion/index.ts` and `css.ts` expose native CSS Motion,
  MotionConfig, createMotion, Button/Panel conveniences, and Size. CssMotion only
  forwards native attributes and the Astra binding/transition; it is not a tween engine.
- CssSize measures natural content with ResizeObserver and sends numeric dimensions
  to Astra CSS. Both axes use max-content width; block mode uses the constrained
  available width. Its axis is immutable; keyed remounts change the sizing mode.
  Measurement cleanup disconnects the observer. Text is never scaled to resize a shell.
- `engine.ts`, `projection.ts`, `scroll.ts`, and `values.ts` remain narrow upstream
  entry points. The pinned archive and provenance are unchanged by this migration.
- The old presence, auto-size, layout controller, layout math, swap, policy,
  diagnostics, and timing JavaScript have been removed together with tests specific
  to those internals. Native CSS design tokens remain. This intentionally breaks
  imports of the removed motion APIs; public UI component props remain compatible.
- AsyncButton, AvatarStack, Chat, Lightbox, DataTable, Outline, Tabs, all 14 UI
  motion scenes, and the six motion lab routes now use the shared Astra policy.
  Positioning and animated surfaces have separate transform ownership. Retained
  exits overlap in grids or use Astra popLayout, preserving intrinsic measurements.
- Essential SSR controls remain visible. Application reduced-motion controls reach
  both bindings and low-level transitions. Binding and Size timing is in seconds;
  the low-level Svelte cssTransition helper takes milliseconds and explicit policy.

## Polish and repository maintenance

The workbench adds a clear CSS/JS comparison, adjustable CSS duration, system-policy
feedback, responsive stages, and valid copyable Svelte examples. Active documentation
uses the new contract; older verification reports are marked historical.

Repository-wide formatting was required to clear the existing lint backlog: 397
files were normalized, with an unused chart tooltip argument removed separately.
No lint rule was disabled. The tracked component reference is regenerated from the
formatted source; its defaults test accepts either JavaScript string quote style.

## Verification

Verified on 2026-09-14, on `integration/astra-motion`:

| Check                                                           | Actual result                                                                                          |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `pnpm run test:unit -- --run`                                   | 62 files, 282 tests passed                                                                             |
| `pnpm check`                                                    | 0 errors, 0 warnings                                                                                   |
| `pnpm lint`                                                     | Complete Prettier and ESLint run, exit 0                                                               |
| `pnpm build`                                                    | Static site written to build, exit 0                                                                   |
| `pnpm motion:verify`                                            | 71 archive entries and all seven entry bundles passed; default/CSS/config contain no JS Motion runtime |
| `DEV_LOCAL_URL=http://127.0.0.1:4086 pnpm exec playwright test` | All 229 tests passed in 2.8 minutes                                                                    |
| Svelte autofixer                                                | Authored components checked; final edits have no issues or suggestions                                 |
| `git diff --check`                                              | Passed                                                                                                 |

The full browser suite includes keyboard activation, exit reversal, reactive
reduced-motion policy, intrinsic layout interpolation without text scaling,
all motion lab routes, 100-node interruption, component documentation, accessibility,
responsive templates, navigation cleanup, and actual local media behavior.
Manual shared-Chrome checks covered the workbench at 1440px and 390px, keyboard
range adjustment, reduced-motion removal, console/network inspection, and screenshots.
The mobile page has no horizontal overflow; no console errors or failed resources
were found. All manually opened tabs were closed.

The first broad browser run found homepage shortcut contrast and an overly broad
lab animation assertion. The badge now uses foreground text; the test inspects
the disclosure's own transition surface. The full rerun passes. Component-reference
regeneration also exposed a quote-style-dependent assertion, corrected before the
final unit run. No test was disabled to obtain these results.

Unit runs still emit Svelte `derived_inert` warnings from disposal paths, and the
build reports existing adapter deprecation/plugin timing/environment notices.
These do not fail the checks; production workbench console inspection is clean.
Generated screenshots and contrast reports from test execution were restored;
the intentional component-reference regeneration is committed. Worker worktrees
created for this migration were reviewed and removed; prerequisite worktrees and
the dirty Astra source were preserved.

## Remaining boundaries

Astra's source archive includes the prerequisite's uncommitted upstream CSS work;
its base commit alone cannot reproduce it. The Astra checkout was preserved.
The optional route adapter declares Kit 2 support and is not imported by this Kit 3
site. Upstream licensing remains unspecified; nothing was published. These are
upstream maintenance boundaries, not reasons to retain a duplicate motion engine.
