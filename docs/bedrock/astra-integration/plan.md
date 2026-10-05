# Astra Motion integration plan

Date: 2026-09-29. Status: implemented and verified; see the
[implementation record](implementation.md) for delivered scope, fixed-budget results
and explicit residuals. At the user's request, verification used focused milestone
checks rather than rerunning the entire repository suite.

## Intended result

Astra becomes Bedrock's standard engine for coordinated motion. Bedrock owns the
visual language, accessible component behavior and application-facing component
contracts. CSS continues to handle simple visual feedback. Existing component
imports and semantics stay stable; richer compositions use Astra's native API
with Bedrock policy and presets.

Success means fewer overlapping animation implementations, consistent interaction
behavior, and useful motion in real components and compositions. Merely upgrading
the archive or adding an animation showcase does not complete this plan.

## Observed starting point

- Bedrock vendors Astra 0.0.1 with a manifest describing an older, partly
  uncommitted source state. The sibling checkout still identifies as 0.0.1 and has
  further uncommitted runtime changes. Version strings alone cannot identify either.
- The sibling package no longer exports `astra-motion/css`. Bedrock's `css.ts`,
  `CssButton`, `CssPanel`, guide, comparison page and tests depend on that entry.
- Bedrock maintains its own layout engine, `Swap`, presence helpers and `autoSize`.
  Tabs, Outline, DataTable, AvatarStack, AsyncButton, Accordion, ChatComposer and
  Lightbox are among its consumers. Site, template and demo consumers also matter.
- Current CSS/TypeScript token values are duplicated. Legacy motion reads the OS
  preference; Astra configuration is separate. New Astra motion components default
  to `reducedMotion="never"`; low-level bindings retain `user`.
- The package verifier assumes the previous export surface and detects Motion
  modules under node_modules paths. New Astra bundles engine modules inside its
  own package, so that exclusion check needs stronger graph inspection.
- Bedrock uses SvelteKit 3.0.0-next.25; Astra's optional Kit adapters declare Kit 2.
  Existing route-continuity research has requirements beyond simply enabling
  native View Transitions.
- Both repositories contain ongoing user changes. No reset, stash, upstream
  cleanup, automatic commit or incidental formatting belongs to this integration.

Evidence: [existing integration](../motion.md), [component audit](../motion-architecture-review.md),
[legacy contract](../motion-contract.md), [package manifest](../../../vendor/astra-motion.json),
[verifier](../../../scripts/verify-motion-package.mjs). The sibling README,
package exports and migration guide were inspected directly. Historical passing
results do not qualify today's dirty checkout or a newly packed archive.

## Responsibility and API boundaries

| Concern                                                               | Decision                                                                                  |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Color, border, focus styling, simple chevrons                         | CSS with Bedrock tokens                                                                   |
| Single measured indicator                                             | Measurement plus CSS unless a concrete behavior needs Astra                               |
| Coordinated layout, shared elements, gesture physics, animated values | Astra                                                                                     |
| Accessible state, focus, keyboard, announcements, async action state  | Bedrock / Bits / existing semantic owner                                                  |
| Intrinsic content sizing                                              | Small measured sizing helper where needed; projection is not a substitute for real reflow |
| Motion character and reduction policy                                 | Bedrock policy applied to both CSS and Astra                                              |
| Custom compositions                                                   | Direct Astra public APIs plus Bedrock presets; no mirror of the entire Astra API          |
| Route transitions                                                     | Separate evaluation; excluded from initial production migration                           |

Ordinary components get sensible internal defaults, not general animation props.
Retain useful semantic options already present, such as AsyncButton's label effect.
Keep low-level compatibility exports while actual consumers need them; do not
silently reinterpret milliseconds as seconds or map incompatible lifecycle modes.
Use narrow Astra imports where supported and measured. Do not invent unexported
subpaths or rely on source aliases/private engine exports.

One owner controls each animated property and each retained exit. Bits presence,
Svelte transitions and Astra presence must not each retain or transform the same
surface. Preserve positioning transforms on separate surfaces where necessary.

## Phase 1 — Freeze the candidate and establish the baseline

Scope: dependency provenance, consumer inventory and baseline evidence.

1. Capture a recoverable Bedrock baseline before measurements: HEAD, separate
   staged/unstaged binary patches, necessary untracked source files and a hash
   manifest. Store the snapshot outside the working tree; preserve index/worktree
   state without reset or stash. Exclude dependency/build caches and secret files.
   Tie all evidence to this snapshot identity. Inventory motion imports across
   components, blocks, site shell, templates, examples, tests and generated
   documentation sources. Distinguish shipped APIs from demonstration-only helpers.
2. Capture an immutable Astra source snapshot including intended dirty runtime
   changes and necessary untracked files, without changing the sibling checkout.
   Record base SHA plus patch/untracked-file hashes, tool versions and archive hash.
   Pack from that isolated snapshot; confirm generated output matches its sources.
   Use a content-identifiable archive filename even if upstream stays at 0.0.1.
3. Record the new package's MIT license and bundled third-party notices. Replace
   obsolete license claims in current docs; preserve dated reports as history.
4. Before any browser baseline, inspect the Vitest client and Playwright E2E runners:
   both currently launch standalone browsers. Resolve shared-browser compatibility
   using a supported runner configuration that attaches to shared Chrome without
   closing it or touching other sessions. Use chrome-devtools for manual checks.
   If the runner cannot comply, mark automated browser baseline/acceptance blocked;
   do not silently substitute a manual smoke test or start another browser. Server
   tests can run separately with `pnpm test:unit --run --project server`, where
   `--project server` selects the Node-only test project.
5. Run the existing package verification, typecheck, permitted unit suites and build
   before migration; record pre-existing failures rather than silently fixing
   unrelated work. Missing browser evidence prevents component acceptance.
6. Capture production bundle graphs and bytes for an ordinary Button page, the docs
   shell, the existing motion page, AsyncButton and AvatarStack. Record source state,
   build configuration and archive identity so comparisons are reproducible.
7. Before component implementation, record numerical budgets in the baseline report:
   maximum initial-route gzip delta, incremental gzip delta when the engine is
   already loaded, and interaction p95 frame-gap/long-task limits for AsyncButton
   and AvatarStack. Derive limits from measured baselines and the intended usage;
   record both absolute and relative limits rather than inventing them in advance.
   Use fixed production fixtures, the same browser version, viewport and CPU
   throttling, and a defined rapid-update sequence over at least three runs. Record
   sample count, warm/cold conditions and measurement method. Measure first-engine
   loading separately so a shared chunk cannot hide first-use cost. These are
   desktop/emulated conditions, not physical-device qualification.
   Unset budgets block component implementation. A breached budget blocks adoption:
   optimize, retain the old implementation, or record a separately reviewed budget
   revision with its rationale before proceeding. Do not raise limits merely to
   turn a failed migration green.

Exit gate: exact source snapshots, candidate, consumer map and numerical performance
budgets are recorded; baseline failures and bundle measurements are separated from
new regressions. No claim that upstream's historical tests validate the newly
captured source state.

## Phase 2 — Upgrade the package and remove the broken CSS dependency

Scope: `vendor/*`, package/lockfile, `scripts/verify-motion-package.mjs`, motion
integration entries/tests, `/motion`, `/docs/motion`, related guide source and README.

Land these changes as one buildable unit:

- Install the exact archive and update provenance and lockfile. Verify installation
  from the archive without any sibling source aliases or separate Motion runtime.
- Replace existing CSS comparison examples with ordinary Bedrock/CSS examples and
  separate Astra examples. Retire `CssButton` / `CssPanel` and the `astra-motion/css`
  bridge after migrating all in-repository consumers; document the explicit removal.
  Do not rebuild Astra's removed CSS backend locally or disguise an engine wrapper
  as a CSS-only component. If inventory reveals a required compatibility contract,
  resolve it before this unit lands, with an explicit migration rather than a shim
  silently importing the engine.
- Validate retained engine/projection/values/scroll exports against the new package.
  Preserve the existing native Bedrock motion barrel for the staged migration.
- Give every newly authored Astra example an explicit OS-respecting configuration
  in this phase; do not introduce the primary API's unrestricted default while
  waiting for Phase 3. Preserve visible essential SSR content. Carry native
  activation, refs/attachments, retained-exit, reversal and accessibility assertions
  from removed wrapper fixtures to their replacements where the behavior remains
  promised; distinguish obsolete export assertions from behavioral regressions.
- Extend verification to recognize packaged engine paths, detect duplicate engine
  identities and React runtime inclusion, and reject route adapters in ordinary UI.
  Bundle actual used component fixtures, not just re-export barrels.
- Measure config-only imports. Do not assume the old no-engine config assertion
  survives: the updated config implementation imports engine transition resolution.
  Keep CSS-only policy independent and scope the Astra bridge to engine consumers if
  a global provider would pull engine code into otherwise ordinary routes.

Exit gate: no imports of removed subpaths; SSR/typecheck/build and affected browser
tests pass; archived and installed files match. Ordinary Button/CSS fixtures have
zero rendered Astra engine modules. No React or duplicate engine. Record actual
raw/gzip deltas for engine consumers before expanding adoption.

## Phase 3 — Establish Bedrock motion policy

Scope: `src/lib/bedrock/motion/`, CSS policy, and the smallest required application
provider integration. Keep token changes separate from backend replacement.

- Create one canonical token definition with generated or mechanically checked CSS
  and TypeScript outputs. Keep canonical durations in milliseconds and convert only
  at Astra boundaries. Preserve current values initially; tune representative recipes
  later in a separate visual change.
- Expose semantic presets for feedback, disclosure, relocation, content replacement
  and gesture settlement. Presets describe behavior; they do not expose arbitrary
  spring knobs on every component.
- Effective reduction is OS preference OR explicit application reduction. A normal
  Bedrock scope cannot re-enable movement beneath a reduced ancestor. Provide a
  safe OS-respecting fallback when a component is used outside the site provider.
- Bridge effective policy to Astra and CSS, including portalled content, without
  depending on CSS ancestry alone. Keep SSR state request-scoped and initial
  essential content visible; do not wait for client preference detection to show it.
- On live preference changes, settle movement to its current intended destination,
  clear transient visual ownership and retain correct focus/state. Bedrock's policy
  must explicitly handle decorative spin/pulse and opacity: Astra's positional
  reduction alone is insufficient to implement the stricter Bedrock contract.
- Include surviving legacy transitions/sizing helpers and third-party moving
  surfaces in the policy coverage ledger. A provider controlling only new Astra
  examples is not a unified policy. Each retained path must honor effective
  reduction or remain explicitly outside the delivered policy claim until fixed.
- Document the custom-composition recipe and its policy requirements. Raw Astra
  remains an advanced escape hatch; its own defaults are not Bedrock guarantees.

Exit gate: OS-only, app-only, nested, portal, provider-free, SSR/hydration and live
reduction cases pass in CSS and engine fixtures. No timing-unit ambiguity or global
SSR preference store. CSS-only usage still excludes the engine.

## Phase 4 — Migrate two representative production components

Migrate independently; each component retains its normal import and public semantics.

1. **AsyncButton:** use Astra for coordinated label replacement, retain the async
   state machine, newest-run behavior, ref, keyboard activation and live status.
   Keep measured shell sizing where real width/height interpolation is required.
   Establish one semantic label and inaccessible outgoing visuals. Test immediate
   resolution, rejection, repeated activation, unmount while pending and long labels.
2. **AvatarStack:** move membership packing to Astra layout while preserving the
   existing identity contract and hover/focus preview behavior. Check duplicate
   identity assumptions before choosing keys; do not casually add a breaking required
   `id` prop. Keep preview positioning independent of layout-owned transforms.
   Test add/remove/reorder, rapid changes, clipped/scrolling parents and image decode.

Use real reflow for natural-size changes and position-only motion for text where
needed. Preserve DOM identity and focus; do not accept distorted text as parity.

Exit gate per component: behavioral tests and production browser interactions pass;
normal, reduced, interrupted, mobile, RTL and zoom cases are recorded. Compare
bundle bytes and interaction traces against Phase 1's fixed budgets. If a budget
or behavioral gate fails,
leave that component on its previous implementation and record the blocker; do not
declare the migration complete. Remove duplicate machinery only after its final
consumer has migrated.

## Phase 5 — Resolve remaining consumers and add one useful composition

Use the full Phase 1 inventory as a closure ledger. Every entry gets a disposition:
CSS, small measurement/lifecycle helper, Astra, or explicitly retained legacy code
with reason and follow-up acceptance criteria.

- Tabs, Outline and DataTable indicators: first evaluate measured CSS interpolation.
  Test scroll/resize/font changes and rapid selection; preserve immediate selection.
- Accordion and ChatComposer: preserve real reflow, focus and disclosure behavior;
  keep lightweight measurement/lifecycle logic if it is the appropriate solution.
- Lightbox and overlay consumers: keep focus traps, scroll lock and gesture ownership
  with their existing owners. Add Astra only after resolving transform/exit ownership.
- Site shell, demos and templates: migrate each inventoried consumer; old labs may
  remain explicitly historical but must not keep unused production engines alive
  accidentally through shared imports.
- Add one real composition using existing Bedrock surfaces: an expandable detail
  card/list with coordinated exit and sibling relocation, using stable item identity,
  keyboard activation and predictable focus return. Start within one page. Retained
  Activity, drag/reorder, scroll choreography and route transitions are follow-ups,
  not requirements for this first composition.

Exit gate: no unclassified consumers, one integrated composition passes the same
accessibility/interruption policy, and overlapping legacy internals with no remaining
consumer are removed. List any remaining legacy engine dependencies explicitly;
do not claim complete engine retirement while they remain.

## Phase 6 — Final verification and documentation

- Run `pnpm motion:verify`, `pnpm check`, `pnpm test:unit --run`, `pnpm build`,
  changed-file formatting/lint, and the affected production E2E suites. `--run`
  makes the unit runner finish after one pass. Record full-repository baseline lint
  failures separately; do not waive new failures or weaken existing assertions.
- Respect the shared-browser contract: manual verification uses Chrome through
  chrome-devtools and a managed preview's allocated loopback URL. Do not launch a
  replacement browser if the shared stack is unavailable. Before executing existing
  automated browser suites, resolve their standalone Playwright launch configuration
  against this contract; arrange shared-CDP execution or record that gate blocked.
- Start previews with dev-preview, inspect console and failed requests, exercise
  changed interactions, and capture before/after or state screenshots for visual
  changes. Close owned tabs. Keep a requested user preview running.
- Assert final state, retained-exit cleanup, immediate semantic updates and no
  accumulating owned observers/subscriptions/animation work after repeated cycles.
  Live OS/application reduction, rapid reversal, resize during exit and navigation
  away during work are required scenarios, not optional visual polish.
- Verify the production graph excludes the engine on CSS-only fixtures and Kit
  adapters everywhere outside explicitly qualified experiments. Report final bundle
  deltas; scope cross-browser/device claims to actually executed checks.
- Update README, motion guide, API examples, component guides and generated
  reference where affected. Mark superseded architecture decisions as such while
  retaining historical evidence. Describe supported contracts and remaining limits.

Completion: the exact archive is qualified in Bedrock; policy and two production
migrations pass; inventory is closed with explicit residuals; the composition is
usable; tests, browser evidence and bundle comparisons support the claims.

## Delivery and rollback

Suggested reviewable units: candidate/baseline record; atomic package and CSS bridge
migration; shared policy; AsyncButton; AvatarStack; remaining-consumer changes;
composition; cleanup/documentation. A component unit includes its own verification.
Do not merge an intermediate package-only upgrade that breaks removed CSS imports.

Keep the prior archive/provenance and recoverable baseline snapshot available until
verification finishes. Record integration-owned patches separately from pre-existing
and subsequent user changes. Roll back package, lockfile and affected integration
consumers together; roll back individual component migrations independently.
Rollback selectively reverses integration-owned changes after inspecting the live
diff; never restore an old full snapshot over subsequent user work. Avoid runtime
switches shipping two engines or indefinitely duplicating every component implementation.

## Explicitly deferred

- A new general Bedrock animation framework or wholesale motion props on controls.
- SvelteKit upgrades, production route-transition adoption or replacing router logic.
- Global replacement of CSS, Bits UI, Vaul, Embla or other semantic/gesture owners.
- Broad aesthetic retuning during the package/backend migration.
- Publishing Astra/Bedrock packages or altering unrelated work in either repository.

## Adversarial review

An independent subagent reviewed the draft against current sources. Three findings
were accepted: move browser-runner preflight before baseline testing, capture a
recoverable Bedrock baseline, and establish numerical performance gates before
component implementation. All three are incorporated above. See the
[review record](plan-review.md) for evidence, severity and dispositions.
