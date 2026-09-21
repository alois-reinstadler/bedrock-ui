# Presence and intrinsic sizing — specialist ledger

Owner: presence specialist. Scope: Bedrock AsyncButton, FieldError, accordion verification, and one production journey test. Original motion engine, public APIs, and durations are unchanged.

| Defect                                                             | Reproduction and root cause                                                                                                                                                                                                                                                               | Fix and evidence                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Late async results outlive removed controls                        | Click AsyncButton with an unresolved action, unmount it, then resolve or reject. Teardown only cleared an existing timer; the pending continuation could create a new reset timer and invoke `onError` after removal.                                                                     | Invalidate the active run on teardown and suppress callbacks after disposal. Before: both regression tests failed (one new reset timer; one late error callback). After: both pass, with neither callback nor timer. Changes: `async-button.svelte` and its browser component tests.                                        |
| Invisible validation metadata creates blank space and empty alerts | Render FieldError with `[{ }, { message: '' }]` between two 20px rows in a 16px-gap stack. The inherited implementation counted error objects before filtering message content, creating an empty alert/list. One visible message mixed with empty metadata also incorrectly used a list. | Filter message-less entries before passing them to the existing renderer. Before: stack measured **88px**, with an empty alert. After: **56px**, the natural two-row layout, with no alert. Three browser tests cover empty, mixed single, and multiple visible messages. Changes: `field-error.svelte`, fixture and tests. |

## Geometry and lifecycle checks

- Existing accordion close/reversal/reduced-motion/force-mount checks pass. The reversal test now compares the final panel with its natural inner height, verifies its final five sampled frames remain within 1px, and checks text has no transform.
- Existing intrinsic-shell interrupted reversal and Swap intermediate-frame tests pass; no shared primitive change was warranted.
- Production `presence-polish.e2e.ts` exercises the real **Save notification preferences** example. It samples pending width, stable height, untransformed content, retained focus, error-to-idle state, preserved checkbox selection, and final shell width against a natural-width clone.
- An initial requestAnimationFrame sampler appeared to show a width rebound (183px → 140.7px). This read occurred before the sizing callback in the same frame. Sampling after all frame callbacks (`requestAnimationFrame` followed by a timer) passes the monotonic-growth assertion. This was a measurement-order artifact, not sufficient evidence for an engine change.

## Verification

- Four relevant Chromium component suites: **46 tests passed** (AsyncButton, FieldError, accordion, and original motion suite).
- Re-run after strengthening the accordion endpoint assertion: **14 focused tests passed**.
- Production E2E against the orchestrator's baseline preview: **1 test passed**. The orchestrator must rerun against the integrated production build.
- Svelte typecheck: **0 errors, 0 warnings**.
- Scoped ESLint and Prettier passed. Svelte autofixer reported no issues or suggestions for all written Svelte components and fixtures.
- No manual Chrome session or preview was opened by this worker. Manual visual review and final integrated checks remain orchestrator-owned.

No speculative animations were added to Collapsible or validation rendering. Their public behavior remains unchanged except that message-less validation metadata no longer creates visible layout or an empty announcement.
