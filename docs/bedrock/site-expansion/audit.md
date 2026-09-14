# Site expansion audit

## Implemented scope

The public site now has one responsive header and a persistent documentation shell. Routes include `/`, `/docs`, `/docs/installation`, `/docs/theming`, `/docs/skills`, `/docs/forms`, `/docs/changelog`, and the components, blocks, and templates catalogues. Changelog has an empty release model and remains absent from navigation.

The registry contains 100 component families. Component detail pages support overview, properties, and accessibility query tabs. Build-time TypeScript extraction resolves 413 public parts and 3,844 entries; only the selected family crosses the server load boundary. Source defaults, aliases, bindings, snippets, callbacks, refs, and data hooks are represented. Inherited native attributes and unresolved external generic contracts retain explicit source links instead of invented types. Descriptions without source JSDoc identify their source constraint; they are not exhaustive prose explanations of every upstream option.

Three reusable blocks—Authentication Panel, Data Toolbar, and Settings Section—have interactive examples and overview/properties pages. Components and blocks reuse the API table. Each block example has its own dynamic import.

Four full-page templates live at `/templates/music-player`, `/templates/video-library`, `/templates/email-client`, and `/templates/social-network`. Their catalogue uses actual page screenshots. Data is fictional and local. Music transport is explicitly simulated; video titles explicitly share the existing captioned sample clip. Email does not transmit messages, and social actions do not publish externally. Each template documents its consumed public APIs; none currently consumes an initial block.

Progressive Blur uses five bounded masked layers and a physical `side` API while retaining legacy orientation/edge props. ScrollArea activates only edges with hidden overflowing content. Both integrated and standalone decorations immediately clear around focus, preserve pointer input, and support reduced-transparency/contrast preferences.

Stepped Form coordinates validation and submission while Stepper remains progress presentation. Stable step IDs, bindable state, async validation, retry, focus recovery, announcements, persistence hooks, and disabled-step native FormData exclusion are documented and tested. Enabled inactive fields remain mounted, hidden, and inert. A remote-functions guide uses current official SvelteKit APIs and clearly distinguishes server-backed source examples from this static site.

## Accessibility decisions

The hard-reload sidebar reliability boundary remains. This project does not claim the upstream Svelte/Bits teardown race is resolved. Query tab links remain usable and survive reload; static generation renders the overview before client query selection.

Frozen shadcn files are unchanged from `29c7416`. Destructive Badge and avatar exceptions remain; multi-thumb Slider labeling remains an upstream decision. Music uses named native range inputs.

The contrast diagnostic samples 72 native Button and 72 anchor Badge text combinations: six variants × two themes × two surfaces × three states. It converts computed colors to sRGB and composites solid ancestor backgrounds after transitions settle. It is not screenshot-pixel measurement and excludes gradients, images, opacity groups, icons, spinners, and focus rings. The recorded 24 below-threshold samples include destructive Button/Badge and light outline/ghost anchor Badge treatments. These additional inherited gaps are disclosed in the relevant accessibility tabs. A passing diagnostic means the measurements completed, not AA conformance. See `contrast-results.json`.

Stepped Form consumers own field-level error relationships, controlled external navigation announcements, structural-change focus recovery, server authorization/idempotency, and any no-JavaScript fallback. Disabled or removed definitions disable their mounted fieldset; enabled inactive values remain available to native FormData.

## Performance

Baseline is `f9281d1`; its only difference from requested `29c7416` is the handed-off homepage constellation. The component detail entry grows from 44,385 bytes to approximately 60.8 KB for the reference renderers. The deduplicated root/docs/detail static import graph grows from 509,279 bytes to approximately 549.7 KB. These are raw JavaScript bytes, excluding CSS, app bootstrap, data payloads, images, and dynamic imports; the route entry is not the whole page cost.

The detail eager graph contains no template, component example, Shiki, PDF runtime, or chart example. Example source is fetched alongside its current live example; Shiki mounts only when that source view opens. The singleton highlighter and bounded 100-result cache remain. Heavy PDF and Shiki language chunks remain dynamic; no warning threshold was raised. `baseline-bundles.json` and `final-bundles.json` retain complete import graphs and final gzip file sizes.

## Verification and evidence

Final verification: `pnpm check` reports zero errors and warnings; `pnpm run test:unit -- --run` passes 344 tests across 62 files; production build passes; the focused production Playwright suite passes 47 tests in 37.8 seconds. Repeated documentation navigation passes 12 tests across three fresh repetitions in 11.9 seconds. Changed-file Prettier passes 113 files, and ESLint passes 97 files. The standalone contrast diagnostic completes all 144 samples without claiming AA conformance. Logs are retained in `verification/`. Production tests run against managed preview `bedrock-site-production`, local `http://127.0.0.1:4066`, user `http://100.64.0.2:4066`. Restart this preview after rebuilding: its static asset index otherwise retains old hashed filenames.

Browser screenshots are under `screenshots/`, covering major templates at mobile/tablet/desktop widths, both themes, reference tabs, shell, Stepped Form, and actual Progressive Blur scroll surfaces. Browser checks include keyboard controls, reduced motion, page errors, failed resources, and responsive overflow. The original inherited Prettier failures were demonstrated in 395 frozen files; only project-changed files are formatted and linted.

The skill-creator validator passes for `skills/bedrock-ui`. Python PyYAML was unavailable, so the unchanged validator ran with a temporary parser adapter using the repository's already-installed YAML package; no dependency was installed. The downloadable skill is available at `/docs/skills/bedrock-ui.md`.

## Ownership and dependency audit

All eight preserved worktrees were inspected before resuming work. Existing workers were reused; no duplicate workers were created. Their original commits and follow-up diffs were reviewed and their checks rerun before cherry-picking. Shell worktree's excluded Forms and skill files remain preserved. No worktree was removed.

No dependencies or lockfile changes were introduced. Package script changes add build-time reference generation; Vite additionally prebundles the genuinely shared mode-watcher and tailwind-merge dependencies. Work remains on `feature/site-experience-pass`; nothing was pushed, merged to main, published, or deployed.
