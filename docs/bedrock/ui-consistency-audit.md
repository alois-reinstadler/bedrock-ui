# Bedrock UI consistency audit

> Repair follow-up: [implementation and verification](ui-consistency-repairs.md). This audit retains its original findings and coverage record.

Audit date: 2026-10-04 (UTC). Repository: `/home/node/repos/bedrock-ui`; base commit `f4c6cc4`, with substantial pre-existing uncommitted changes. This report audits the working tree, not just that commit. **Audit only: no application source was repaired.**

## 1. Executive findings

The public import boundary is largely respected. The consistency problem is mainly **custom compositions and CSS overrides around Bedrock components**, rather than direct imports from the frozen upstream tree. Correct imports alone do not ensure consistent corners, accessible controls, or motion behavior.

| Priority | Finding                                                                  | Impact / first repair boundary                                                                                                                                                                    |
| -------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1       | F01 — Rounded surfaces outside `data-slot` lose the theme's corner shape | Repeated across documentation, examples, homepage, shared table frames and template controls. Fix shared compositions first; use Card only for appropriate surfaces.                              |
| P1       | F02 — Homepage custom tilt ignores reduced motion                        | Decorative 3D movement continues with the OS preference enabled. Fix `HeroPlayground`, using the existing motion policy.                                                                          |
| P1       | F03 — Three demos overflow a narrow viewport                             | ERP, continuity lab and stress fixture require page-level horizontal scrolling. Fix their constraints, not the global body overflow.                                                              |
| P1       | F04 — Local template styling introduces readable-text contrast failures  | Calendar out-of-month dates and video account/footer text fall below the measured AA requirement. Fix the template palette/opacity decisions.                                                     |
| P2       | F11 — Shared Tooltip loses its accessible description                    | Visible tooltip content lacks an ID/role and triggers have empty `aria-describedby` in dev and production. Repair the shared integration boundary.                                                |
| P2       | F05 — Template controls use incompatible geometry and theme boundaries   | Round custom navigation/panels sit beside theme-shaped Bedrock controls; fixed radii ignore radius changes. Consolidate scoped template tokens and shared navigation compositions.                |
| P2       | F06 — Video dropdowns bypass the shared overlay interaction contract     | Escape and outside interaction leave floating native-details panels open. Compose Bedrock Dropdown Menu.                                                                                          |
| P2       | F07 — Invalid SvelteKit link options pollute development diagnostics     | Every component documentation tab and the shared template layout use unsupported option values. Fix the two shared owners.                                                                        |
| P2       | F08 — The current development Form example is not usable                 | Superforms reaches removed `$app/stores`; disabled/loading UI persists. **Production Form smoke checks pass**, so investigate the development transform/cache boundary before changing Form APIs. |
| P2       | F09 — Music player artwork link has no accessible name                   | Every music route inherits an unnamed keyboard-focusable link. Fix the persistent player composition.                                                                                             |
| P2       | F10 — Route errors abandon the Bedrock application shell                 | Missing dynamic records render generic error pages without useful navigation. Add a shared error composition.                                                                                     |

P1 means a user-visible accessibility, responsive-layout, or widespread system-contract defect deserving the first repair batches. P2 means a localized or shared consistency/usability defect with a narrower impact. No P0 outage was established.

The previously reported `/docs` introduction panels and sidebar hover/active mismatch are **already corrected in this working tree**. Hover and active highlights both computed to `12.8px / superellipse(3)` and both followed a temporary `--corner-shape: bevel` override. Do not re-fix them.

## 2. Method, evidence and coverage limits

Two passes were performed: registry/filesystem/source inspection, then real Chromium navigation and interaction. The local [Bedrock review skill](../../skills/bedrock-ui/SKILL.md), [component contract](component-contract.md), theme CSS and actual component exports were the comparison standard. The T3 collaborative browser returned an explicit unavailable error for both status and open. Named agent-browser sessions were used instead; Playwright attached to those sessions for repeatable computed-style, state, console and network collection. No shared user Chrome tabs or logins were altered.

The primary preview was the existing development server at `http://127.0.0.1:4513`. A separate Portless production preview at allocated port `4850` was used for targeted production checks. The fallback port-preview manager had no free allocations; no existing allocation was stopped or repurposed.

Default-page sampling used **1440 × 900 and 390 × 900**, each with light and dark appearance. These are desktop Chromium CSS viewports, not physical mobile devices. The broad pass changed the root dark class as well as appearance emulation to avoid a saved color-mode preference masking the requested state. Actual ThemeToggle behavior was checked separately. Temporary token overrides and simulated failed source requests were browser-only experiments.

“Visited” and “inspected” below do **not** mean all interactions on a route passed. The audit explicitly separates initial render/computed-style coverage from deeper state coverage. Automated metrics include visible element geometry, radius **and** `corner-shape`, colors, type, shadows, overflow, cursors, disabled/selected/expanded attributes, broken images, console messages, failed requests and HTTP failures. Screenshots were examined for the findings, not for every element in every state.

### Evidence index

- [Expanded route and registry inventory](ui-consistency-evidence/inventory.json).
- [Consumer source inventory](ui-consistency-evidence/source-inventory.json): 401 Svelte consumer files scanned for imports, controls, styling and custom interaction roles.
- [Native-surface candidates](ui-consistency-evidence/corner-candidates.json): 220 syntactic candidates in 147 files, with exact lines. **This is a triage list, not 220 independently verified defects.** Decorative art, layout and intentional round clipping require individual classification.
- [Focused computed-style comparisons](ui-consistency-evidence/detail-styles.json), [shared interaction checks](ui-consistency-evidence/interactions.json), [corrected state checks](ui-consistency-evidence/state-checks.json), [follow-up checks](ui-consistency-evidence/followup.json), [template workflows](ui-consistency-evidence/workflows.json).
- [Every component's example/code checks](ui-consistency-evidence/examples.json), [all map gallery variants](ui-consistency-evidence/map-gallery.json), [targeted production results](ui-consistency-evidence/production.json).
- [Shared control checks](ui-consistency-evidence/shared-final.json) and [corrected Tooltip/Select checks](ui-consistency-evidence/tooltip-select-retry.json).
- [Initial axe results](ui-consistency-evidence/axe.json). Only findings reproduced with a verified URL/theme in `workflows.json` are promoted here. Automated accessibility scans are not screen-reader certification.

Some first attempts encountered hydration timing, selector or hidden-preview issues. Those are retained in raw evidence for transparency. Corrected runs supersede them where explicitly stated; they are not automatically application defects. Early homepage resize measurements showed transient overflow; the settled mobile page measured exactly 390px and is **not** reported as a persistent overflow defect.

### Coverage totals and status key

- **58 page patterns, 258 concrete route URLs; all 258 were visited.** Expansion uses actual component/block/shader registries and template data, not guessed slugs. There are 47 static URLs and 211 expanded dynamic URLs.
- **127 component documentation pages:** Overview, Properties and Accessibility were opened. The two query tabs add 254 URL states. All 126 non-Form components have desktop/mobile × light/dark render samples for all three tabs after retries. Form is blocked in the current dev runtime; its three tabs passed a targeted production smoke, not the full production viewport matrix.
- **254 preview/example source modules** (one of each per documented component) were inventoried. Preview/Code frames were opened across all 127 pages; seven initial selector failures were corrected. Map adds 22 selectable examples, all rendered at least once. This does not mean all controls within those examples were operated.
- The first pass contains 1,032 initial viewport/theme samples and 999 additional tab samples. These raw counts include the initial timing/contamination attempts. Aspect Ratio and Async Button were independently repeated; the corrected evidence, not the inflated sample count, determines coverage.
- 14 invalid/missing-record URLs, 12 template feedback query states, video search hit/empty states and one generated local social post were also visited. Nine shared layouts were source-inventoried and observed through their consumers.

**I = inspected** for the named check only; **P = partially inspected**; **B = blocked**; **N = not inspected**. **I4** means initial render and computed-style sampling at 1440/light, 1440/dark, 390/light and 390/dark. It does not certify every element or interaction in those configurations. Every route's overall state coverage remains **P** unless marked B for a specific state. No route below is certified exhaustive.

Source coverage is **P across the application**: every consumer in the source inventory was scanned, and shared owners/findings were read in depth. A scan is not a line-by-line semantic review of every implementation. [Full raw browser data, gzip JSON](ui-consistency-evidence/sweep-0.json.gz), [compact route results](ui-consistency-evidence/route-summary.json), [route retries](ui-consistency-evidence/route-retry.json), [example retries](ui-consistency-evidence/examples-retry.json), and [final corrected workflows](ui-consistency-evidence/final-states.json) retain the actual evidence.

### Component routes, documentation tabs and examples

Each row resolves the shared page `src/routes/docs/components/[slug]/+page.svelte`; the preview and example modules are `src/lib/site/previews/<slug>.svelte` and `src/lib/site/examples/<slug>.svelte`. “Properties” means `?tab=properties`; “Accessibility” means `?tab=accessibility`. The named component's complete registry responsibility is in [the inventory](ui-consistency-evidence/inventory.json).

The final column marks deeper component behavior **P**: default variants were rendered and shared ExampleCard behavior checked, but the complete hover/focus/pressed/disabled/selected/expanded/value/loading/error matrix for that component was **N unless listed in the shared/state checklist below**. Static display components do not acquire artificial interaction requirements.

| Concrete route                         | Overview            | Properties          | Accessibility       | Preview/Code frames    | Deeper states |
| -------------------------------------- | ------------------- | ------------------- | ------------------- | ---------------------- | ------------- |
| `/docs/components/accordion`           | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/alert`               | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/alert-dialog`        | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/animated-gradient`   | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/animated-signature`  | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/aspect-ratio`        | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/async-button`        | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/attachment`          | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/avatar`              | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/badge`               | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/banner`              | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/blockquote`          | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/breadcrumb`          | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/bubble`              | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/button`              | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/button-group`        | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/calendar`            | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/card`                | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/carousel`            | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/chart`               | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/chat`                | I4                  | I4                  | I4                  | I (11 frames)          | P             |
| `/docs/components/checkbox`            | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/indicator`           | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/checkbox-list`       | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/citation`            | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/clickable-card`      | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/code-block`          | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/collapsible`         | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/color-area`          | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/color-field`         | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/color-picker`        | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/color-slider`        | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/color-swatch`        | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/color-swatch-picker` | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/combobox`            | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/command`             | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/context-menu`        | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/data-table`          | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/date-input`          | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/date-range-input`    | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/date-time-input`     | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/dialog`              | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/diff`                | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/dot-pattern`         | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/drawer`              | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/dropdown-menu`       | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/emoji`               | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/empty`               | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/feedback`            | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/field`               | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/field-status`        | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/file-input`          | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/form`                | B dev; I production | B dev; I production | B dev; I production | P; dev runtime blocked | P             |
| `/docs/components/grid-pattern`        | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/heading`             | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/hover-card`          | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/icon`                | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/icon-button`         | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/image`               | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/input`               | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/input-group`         | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/input-otp`           | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/item`                | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/kbd`                 | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/label`               | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/light-rays`          | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/lightbox`            | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/link`                | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/list`                | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/map`                 | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/markdown`            | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/marker`              | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/marquee`             | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/menubar`             | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/message`             | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/metadata-list`       | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/multi-selector`      | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/native-select`       | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/navigation-menu`     | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/noise-overlay`       | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/number-input`        | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/outline`             | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/overflow-list`       | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/pagination`          | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/pdf-viewer`          | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/phone-input`         | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/popover`             | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/progress`            | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/progressive-blur`    | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/qr-code`             | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/radio-group`         | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/range-calendar`      | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/resizable`           | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/scroll-area`         | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/select`              | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/selectable-card`     | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/selector`            | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/separator`           | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/shapes`              | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/sheet`               | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/sidebar`             | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/skeleton`            | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/slider`              | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/sonner`              | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/spinner`             | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/spotlight`           | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/status-dot`          | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/stepped-form`        | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/stepper`             | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/switch`              | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/table`               | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/tabs`                | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/text`                | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/text-highlight`      | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/text-shimmer`        | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/textarea`            | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/thumbnail`           | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/tilt-card`           | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/time-input`          | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/timestamp`           | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/toggle`              | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/toggle-group`        | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/token`               | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/tokenizer`           | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/tooltip`             | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/video-player`        | I4                  | I4                  | I4                  | I (2 frames)           | P             |
| `/docs/components/visually-hidden`     | I4                  | I4                  | I4                  | I (2 frames)           | P             |

### All other concrete routes

Every row below is **P overall**, with **I4** initial appearance samples. Family codes point to the relevant state obligations in the next checklist. A route rendering another view after a redirect still counts as a visited entry URL, not an additional independent composition. The inventory includes all 5 mail folders × all 7 message IDs, plus each folder-only state: some messages are deliberately outside the selected folder but remain valid direct URLs.

| Concrete route                                              | Initial layout/themes | State family | Page source                                                                |
| ----------------------------------------------------------- | --------------------- | ------------ | -------------------------------------------------------------------------- |
| `/`                                                         | I4                    | P — HOME     | `src/routes/+page.svelte`                                                  |
| `/demo`                                                     | I4                    | P — LAB      | `src/routes/demo/+page.svelte`                                             |
| `/demo/chat`                                                | I4                    | P — LAB      | `src/routes/demo/chat/+page.svelte`                                        |
| `/demo/component-motion`                                    | I4                    | P — LAB      | `src/routes/demo/component-motion/+page.svelte`                            |
| `/demo/contrast`                                            | I4                    | P — LAB      | `src/routes/demo/contrast/+page.svelte`                                    |
| `/demo/erp`                                                 | I4                    | P — LAB      | `src/routes/demo/erp/+page.svelte`                                         |
| `/demo/motion`                                              | I4                    | P — LAB      | `src/routes/demo/motion/+page.svelte`                                      |
| `/demo/motion-route-prototype/detail/a`                     | I4                    | P — LAB      | `src/routes/demo/motion-route-prototype/detail/[id]/+page.svelte`          |
| `/demo/motion-route-prototype/detail/b`                     | I4                    | P — LAB      | `src/routes/demo/motion-route-prototype/detail/[id]/+page.svelte`          |
| `/demo/motion-route-prototype/list`                         | I4                    | P — LAB      | `src/routes/demo/motion-route-prototype/list/+page.svelte`                 |
| `/demo/motion-test`                                         | I4                    | P — LAB      | `src/routes/demo/motion-test/+page.svelte`                                 |
| `/demo/motion/accessibility`                                | I4                    | P — LAB      | `src/routes/demo/motion/accessibility/+page.svelte`                        |
| `/demo/motion/components`                                   | I4                    | P — LAB      | `src/routes/demo/motion/components/+page.svelte`                           |
| `/demo/motion/concurrency`                                  | I4                    | P — LAB      | `src/routes/demo/motion/concurrency/+page.svelte`                          |
| `/demo/motion/continuity`                                   | I4                    | P — LAB      | `src/routes/demo/motion/continuity/+page.svelte`                           |
| `/demo/motion/foundations`                                  | I4                    | P — LAB      | `src/routes/demo/motion/foundations/+page.svelte`                          |
| `/demo/playwright`                                          | I4                    | P — LAB      | `src/routes/demo/playwright/+page.svelte`                                  |
| `/demo/ui`                                                  | I4                    | P — LAB      | `src/routes/demo/ui/+page.svelte`                                          |
| `/demo/ui-page-transitions`                                 | I4                    | P — LAB      | `src/routes/demo/ui-page-transitions/+page.svelte`                         |
| `/docs`                                                     | I4                    | P — DOCS     | `src/routes/docs/+page.svelte`                                             |
| `/docs/blocks`                                              | I4                    | P — DOCS     | `src/routes/docs/blocks/+page.svelte`                                      |
| `/docs/blocks/authentication-panel`                         | I4                    | P — BLOCK    | `src/routes/docs/blocks/[slug]/+page.svelte`                               |
| `/docs/blocks/settings-section`                             | I4                    | P — BLOCK    | `src/routes/docs/blocks/[slug]/+page.svelte`                               |
| `/docs/changelog`                                           | I4                    | P — DOCS     | `src/routes/docs/changelog/+page.svelte`                                   |
| `/docs/components`                                          | I4                    | P — DOCS     | `src/routes/docs/components/+page.svelte`                                  |
| `/docs/forms`                                               | I4                    | P — DOCS     | `src/routes/docs/forms/+page.svelte`                                       |
| `/docs/installation`                                        | I4                    | P — DOCS     | `src/routes/docs/installation/+page.svelte`                                |
| `/docs/motion`                                              | I4                    | P — DOCS     | `src/routes/docs/motion/+page.svelte`                                      |
| `/docs/shaders`                                             | I4                    | P — DOCS     | `src/routes/docs/shaders/+page.svelte`                                     |
| `/docs/shaders/dithering`                                   | I4                    | P — SHADER   | `src/routes/docs/shaders/[slug]/+page.svelte`                              |
| `/docs/shaders/fluted-glass`                                | I4                    | P — SHADER   | `src/routes/docs/shaders/[slug]/+page.svelte`                              |
| `/docs/shaders/god-rays`                                    | I4                    | P — SHADER   | `src/routes/docs/shaders/[slug]/+page.svelte`                              |
| `/docs/shaders/grain-gradient`                              | I4                    | P — SHADER   | `src/routes/docs/shaders/[slug]/+page.svelte`                              |
| `/docs/shaders/halftone-dots`                               | I4                    | P — SHADER   | `src/routes/docs/shaders/[slug]/+page.svelte`                              |
| `/docs/shaders/heatmap`                                     | I4                    | P — SHADER   | `src/routes/docs/shaders/[slug]/+page.svelte`                              |
| `/docs/shaders/image-dithering`                             | I4                    | P — SHADER   | `src/routes/docs/shaders/[slug]/+page.svelte`                              |
| `/docs/shaders/liquid-metal`                                | I4                    | P — SHADER   | `src/routes/docs/shaders/[slug]/+page.svelte`                              |
| `/docs/shaders/mesh-gradient`                               | I4                    | P — SHADER   | `src/routes/docs/shaders/[slug]/+page.svelte`                              |
| `/docs/shaders/neuro-noise`                                 | I4                    | P — SHADER   | `src/routes/docs/shaders/[slug]/+page.svelte`                              |
| `/docs/shaders/warp`                                        | I4                    | P — SHADER   | `src/routes/docs/shaders/[slug]/+page.svelte`                              |
| `/docs/shaders/water`                                       | I4                    | P — SHADER   | `src/routes/docs/shaders/[slug]/+page.svelte`                              |
| `/docs/skills`                                              | I4                    | P — DOCS     | `src/routes/docs/skills/+page.svelte`                                      |
| `/docs/templates`                                           | I4                    | P — DOCS     | `src/routes/docs/templates/+page.svelte`                                   |
| `/docs/theming`                                             | I4                    | P — DOCS     | `src/routes/docs/theming/+page.svelte`                                     |
| `/motion`                                                   | I4                    | P — LAB      | `src/routes/motion/+page.svelte`                                           |
| `/templates/email-client`                                   | I4                    | P — EMAIL    | `src/routes/templates/email-client/+page.svelte`                           |
| `/templates/email-client/calendar`                          | I4                    | P — EMAIL    | `src/routes/templates/email-client/calendar/+page.svelte`                  |
| `/templates/email-client/mail/archive`                      | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/archive/arden-contract`       | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/archive/eli-field-recordings` | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/archive/june-research-window` | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/archive/marin-launch-notes`   | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/archive/mina-weekly-digest`   | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/archive/nora-prototype`       | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/archive/theo-studio-key`      | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/drafts`                       | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/drafts/arden-contract`        | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/drafts/eli-field-recordings`  | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/drafts/june-research-window`  | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/drafts/marin-launch-notes`    | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/drafts/mina-weekly-digest`    | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/drafts/nora-prototype`        | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/drafts/theo-studio-key`       | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/inbox`                        | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/inbox/arden-contract`         | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/inbox/eli-field-recordings`   | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/inbox/june-research-window`   | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/inbox/marin-launch-notes`     | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/inbox/mina-weekly-digest`     | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/inbox/nora-prototype`         | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/inbox/theo-studio-key`        | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/sent`                         | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/sent/arden-contract`          | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/sent/eli-field-recordings`    | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/sent/june-research-window`    | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/sent/marin-launch-notes`      | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/sent/mina-weekly-digest`      | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/sent/nora-prototype`          | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/sent/theo-studio-key`         | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/starred`                      | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/starred/arden-contract`       | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/starred/eli-field-recordings` | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/starred/june-research-window` | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/starred/marin-launch-notes`   | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/starred/mina-weekly-digest`   | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/starred/nora-prototype`       | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/mail/starred/theo-studio-key`      | I4                    | P — EMAIL    | `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.svelte` |
| `/templates/email-client/tasks`                             | I4                    | P — EMAIL    | `src/routes/templates/email-client/tasks/+page.svelte`                     |
| `/templates/music-player`                                   | I4                    | P — MUSIC    | `src/routes/templates/music-player/+page.svelte`                           |
| `/templates/music-player/album/after-hours`                 | I4                    | P — MUSIC    | `src/routes/templates/music-player/album/[slug]/+page.svelte`              |
| `/templates/music-player/album/slow-mornings`               | I4                    | P — MUSIC    | `src/routes/templates/music-player/album/[slug]/+page.svelte`              |
| `/templates/music-player/album/sunday-drive`                | I4                    | P — MUSIC    | `src/routes/templates/music-player/album/[slug]/+page.svelte`              |
| `/templates/music-player/album/the-lounge`                  | I4                    | P — MUSIC    | `src/routes/templates/music-player/album/[slug]/+page.svelte`              |
| `/templates/music-player/credits`                           | I4                    | P — MUSIC    | `src/routes/templates/music-player/credits/+page.svelte`                   |
| `/templates/music-player/discover`                          | I4                    | P — MUSIC    | `src/routes/templates/music-player/discover/+page.svelte`                  |
| `/templates/music-player/library`                           | I4                    | P — MUSIC    | `src/routes/templates/music-player/library/+page.svelte`                   |
| `/templates/music-player/liked`                             | I4                    | P — MUSIC    | `src/routes/templates/music-player/liked/+page.svelte`                     |
| `/templates/music-player/lyrics`                            | I4                    | P — MUSIC    | `src/routes/templates/music-player/lyrics/+page.svelte`                    |
| `/templates/music-player/recent`                            | I4                    | P — MUSIC    | `src/routes/templates/music-player/recent/+page.svelte`                    |
| `/templates/music-player/visualizer`                        | I4                    | P — MUSIC    | `src/routes/templates/music-player/visualizer/+page.svelte`                |
| `/templates/social-network`                                 | I4                    | P — SOCIAL   | `src/routes/templates/social-network/+page.svelte`                         |
| `/templates/social-network/bookmarks`                       | I4                    | P — SOCIAL   | `src/routes/templates/social-network/bookmarks/+page.svelte`               |
| `/templates/social-network/explore`                         | I4                    | P — SOCIAL   | `src/routes/templates/social-network/explore/+page.svelte`                 |
| `/templates/social-network/notifications`                   | I4                    | P — SOCIAL   | `src/routes/templates/social-network/notifications/+page.svelte`           |
| `/templates/social-network/post/city-after-dark`            | I4                    | P — SOCIAL   | `src/routes/templates/social-network/post/[id]/+page.svelte`               |
| `/templates/social-network/post/good-interfaces`            | I4                    | P — SOCIAL   | `src/routes/templates/social-network/post/[id]/+page.svelte`               |
| `/templates/social-network/post/human-scale`                | I4                    | P — SOCIAL   | `src/routes/templates/social-network/post/[id]/+page.svelte`               |
| `/templates/social-network/post/in-motion`                  | I4                    | P — SOCIAL   | `src/routes/templates/social-network/post/[id]/+page.svelte`               |
| `/templates/social-network/post/less-but-better`            | I4                    | P — SOCIAL   | `src/routes/templates/social-network/post/[id]/+page.svelte`               |
| `/templates/social-network/post/long-way-home`              | I4                    | P — SOCIAL   | `src/routes/templates/social-network/post/[id]/+page.svelte`               |
| `/templates/social-network/profile/aya`                     | I4                    | P — SOCIAL   | `src/routes/templates/social-network/profile/[handle]/+page.svelte`        |
| `/templates/social-network/profile/leo`                     | I4                    | P — SOCIAL   | `src/routes/templates/social-network/profile/[handle]/+page.svelte`        |
| `/templates/social-network/profile/mina`                    | I4                    | P — SOCIAL   | `src/routes/templates/social-network/profile/[handle]/+page.svelte`        |
| `/templates/social-network/profile/nora`                    | I4                    | P — SOCIAL   | `src/routes/templates/social-network/profile/[handle]/+page.svelte`        |
| `/templates/social-network/profile/sam`                     | I4                    | P — SOCIAL   | `src/routes/templates/social-network/profile/[handle]/+page.svelte`        |
| `/templates/video-library`                                  | I4                    | P — VIDEO    | `src/routes/templates/video-library/+page.svelte`                          |
| `/templates/video-library/genres/action`                    | I4                    | P — VIDEO    | `src/routes/templates/video-library/genres/[genre]/+page.svelte`           |
| `/templates/video-library/genres/animation`                 | I4                    | P — VIDEO    | `src/routes/templates/video-library/genres/[genre]/+page.svelte`           |
| `/templates/video-library/genres/comedy`                    | I4                    | P — VIDEO    | `src/routes/templates/video-library/genres/[genre]/+page.svelte`           |
| `/templates/video-library/genres/fantasy`                   | I4                    | P — VIDEO    | `src/routes/templates/video-library/genres/[genre]/+page.svelte`           |
| `/templates/video-library/genres/science-fiction`           | I4                    | P — VIDEO    | `src/routes/templates/video-library/genres/[genre]/+page.svelte`           |
| `/templates/video-library/my-list`                          | I4                    | P — VIDEO    | `src/routes/templates/video-library/my-list/+page.svelte`                  |
| `/templates/video-library/search`                           | I4                    | P — VIDEO    | `src/routes/templates/video-library/search/+page.svelte`                   |
| `/templates/video-library/title/big-buck-bunny`             | I4                    | P — VIDEO    | `src/routes/templates/video-library/title/[slug]/+page.svelte`             |
| `/templates/video-library/title/caminandes`                 | I4                    | P — VIDEO    | `src/routes/templates/video-library/title/[slug]/+page.svelte`             |
| `/templates/video-library/title/sintel`                     | I4                    | P — VIDEO    | `src/routes/templates/video-library/title/[slug]/+page.svelte`             |
| `/templates/video-library/title/tears-of-steel`             | I4                    | P — VIDEO    | `src/routes/templates/video-library/title/[slug]/+page.svelte`             |
| `/templates/video-library/watch/big-buck-bunny`             | I4                    | P — VIDEO    | `src/routes/templates/video-library/watch/[slug]/+page.svelte`             |
| `/templates/video-library/watch/caminandes`                 | I4                    | P — VIDEO    | `src/routes/templates/video-library/watch/[slug]/+page.svelte`             |
| `/templates/video-library/watch/sintel`                     | I4                    | P — VIDEO    | `src/routes/templates/video-library/watch/[slug]/+page.svelte`             |
| `/templates/video-library/watch/tears-of-steel`             | I4                    | P — VIDEO    | `src/routes/templates/video-library/watch/[slug]/+page.svelte`             |

### Shared owners and state checklist

The following named checks were exercised directly. Shared coverage applies to the implementation; each consumer still only has the route sampling recorded above. “Remaining N” is an explicit list of untested obligations, not an assertion that the controls are broken.

| Owner / family                                                                                                             | Inspected states and results                                                                                                                                                                   | Remaining N or blocked states                                                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Root layout — `src/routes/+layout.svelte`                                                                                  | I: inherited providers, theme rendering, site navigation presence through route sweep                                                                                                          | N: every nested Tooltip/Sonner combination, no-JS and early initialization failure                                                                                                                    |
| Docs layout — `src/routes/docs/+layout.svelte`                                                                             | I: active/hover sidebar corners and token override, no-results search, mobile sheet open/Escape/focus return                                                                                   | N: every sidebar item with keyboard, all desktop collapsed/resize combinations                                                                                                                        |
| Component docs shared tabs/ExampleCard/Outline                                                                             | I: all page tabs opened; Preview/Code source; simulated source 503/error/retry; Button dialog disabled Save/Escape/focus return; hydrated top/bottom outline and sidebar/back scroll on Button | P: each page's sampled bottom Outline. N: every anchor at top/bottom, all hash/back/forward permutations, clipboard failure/success, interrupted route transitions                                    |
| Template shared layout — `src/routes/templates/+layout.svelte`                                                             | I: switcher open/Escape, active/hover geometry, actual theme toggle, feedback review/developer/off query modes in four templates; video review succeeds after hydration                        | N: annotate/export/reset/draft conflict workflows, all minimize/collapse overlaps and keyboard switcher destinations                                                                                  |
| Music layout — `src/routes/templates/music-player/+layout.svelte` / MUSIC                                                  | I: every route default; mobile queue open/close; desktop like pressed false→true; unnamed artwork link; shared colors/corners                                                                  | N: complete playback/seek/volume/shuffle/repeat, media failure/recovery, all keyboard shortcuts, lyrics/visualizer reduced motion, library filters and persisted history                              |
| Social layout — `src/routes/templates/social-network/+layout.svelte` / SOCIAL                                              | I: every seeded route; browser-local post creation and detail navigation; missing local-post empty state; navigation/Post geometry                                                             | N: complete reply/repost/quote/follow/bookmark/notification transitions, edit/delete, dialogs, media errors and keyboard matrix                                                                       |
| Video layout — `src/routes/templates/video-library/+layout.svelte` / VIDEO                                                 | I: every title/watch/genre default; Genres Escape/outside non-dismissal; theme boundary; search hit/empty; My List empty; contrast                                                             | P: account menu source/presentation; its full dismissal sequence not separately replayed. N: playback/network failure, all controls and title save/remove persistence, watch full-screen/PiP/keyboard |
| Email layout — `src/routes/templates/email-client/+layout.svelte` / EMAIL                                                  | I: all folder/message combinations; calendar dark contrast; task add/complete/Completed/search-empty; inline compose open/Back                                                                 | N: full send/draft/reply/forward/archive/delete/undo flows, calendar create/edit/reschedule/view modes, task edit/due-date and mobile split-view matrix                                               |
| Motion layouts — `src/routes/demo/motion/+layout.svelte` and `src/routes/demo/motion-route-prototype/+layout.svelte` / LAB | I: every lab/prototype route default in four configurations; ERP tab End selects No Matches; settled narrow ERP/continuity/stress widths                                                       | N: all lab policy modes, stress sequences, rapid re-entry/reversal, drag/sort, table expansion, preset controls, prototype back/forward transitions. No broad motion pass claim.                      |
| HOME — HeroPlayground and homepage                                                                                         | I: desktop/mobile settled layout, native/Card comparison, OS reduced-motion pointer movement and recording                                                                                     | N: every hover/focus plane, live policy toggle, keyboard focus choreography and touch-device behavior                                                                                                 |
| DOCS — guides/catalogues                                                                                                   | I: all guide routes, component/template filtered-empty states, forms walkthrough validation/Continue/review/success in production                                                              | N: every native disclosure open/close in each theme; installation copy paths; all theming controls; forms rejected/repeated submission and multiple simultaneous forms                                |
| BLOCK — Authentication Panel                                                                                               | I: invalid input, pending aria-busy, rejected sign-in, retry, success/password clearing                                                                                                        | N: all alternate/recovery links and keyboard/focus trajectories in all four configurations                                                                                                            |
| BLOCK — Settings Section                                                                                                   | I: initial disabled submit, dirty, pending disabled submit, error and successful retry                                                                                                         | N: all field combinations, reset/removal, focus/live announcement verification with screen reader                                                                                                     |
| SHADER — all 12 shader detail routes                                                                                       | I4: initial shader/fallback composition                                                                                                                                                        | N: every parameter, resize/reduced-motion mode, GPU/context-loss fallback, long-running performance and image failure                                                                                 |

Additional shared checks: **I** — DropdownMenu keyboard open/End/Escape and focus return; Select keyboard open/End selects Schist, Escape and focus return; Tabs default/line × horizontal/vertical ArrowRight/ArrowDown selects Activity log and updates the panel. Tooltip hover/focus/escape were **I**, with F11 confirmed; semantic success is not claimed. These production checks were desktop/light only; their full theme/viewport/disabled/nesting matrices remain **N**.

### Cross-cutting interaction-state coverage

| State/check                              | Status and actual reach                                                                                                                                  |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hover and active                         | P — docs sidebar, template switcher, sampled example controls; not all consumer hit areas                                                                |
| Focus-visible / keyboard                 | P — mobile sidebar and dialog focus restoration, DataTable End, documentation source tabs; not a complete tab-order/focus-ring audit                     |
| Pressed                                  | P — music like false→true; other toggles remain N beyond default attributes                                                                              |
| Disabled                                 | P — auth/settings pending, dialog empty Save, rendered default disabled controls; not every disabled tooltip/label combination                           |
| Selected and expanded                    | P — docs tabs, map selector, task filter, ERP tab, queue, switcher, Genres; other component values remain N                                              |
| Loading                                  | P — lazy examples/source fetching, async blocks and stepped-form submission; not every delayed/remounted layout                                          |
| Empty                                    | P — catalogue searches, docs sidebar search, tasks, video search/My List, local missing social post and folder-only compositions                         |
| Error and recovery                       | P — 14 invalid URL states, source 503/retry, authentication/settings errors; general 500/offline/media/upload failures remain N                          |
| Radius, corner-shape and nested clipping | P — computed samples across all routes; targeted Card/native comparisons and token changes; not every nested clip or unsupported-engine fallback         |
| Typography, spacing, alignment, shadows  | P — computed samples plus focused screenshots; no exhaustive per-text baseline grid audit                                                                |
| Contrast / translucent overlays          | P — targeted axe and verified calendar/video/music samples; image/video-dependent overlays not fully measured                                            |
| Cursors / hit areas                      | P — computed samples and selected interactions; physical touch hit areas and every icon remain N                                                         |
| Motion / reduced motion / layout shifts  | P — confirmed Hero recording, settled overflow retries; rapid interruption/reversal and stale indicators remain N outside named checks                   |
| Navigation / history / scroll / TOC      | P — all direct routes, all component tabs, one sidebar history/scroll and focused Outline check; full page-by-page top/bottom/history behavior remains N |
| Console / network                        | I collection on all route visits; P diagnosis — F07/F08 confirmed, development warning attribution and aborted resources not exhaustively resolved       |

### Map gallery states

All options from the actual example selector were opened. The location finder and each other option are separate states within `/docs/components/map`. The 22-row ledger below avoids treating the first map as coverage of the rest.

| Actual selector option                                | Rendered state | Deep interaction / full four-configuration matrix |
| ----------------------------------------------------- | -------------- | ------------------------------------------------- |
| Map — Location finder (`LocationsExample`)            | I              | N                                                 |
| Map — Lazy loading (`LazyMapExample`)                 | I              | N                                                 |
| Map — Basic map (`BasicMapExample`)                   | I              | N                                                 |
| Map — Controlled viewport (`ControlledMapExample`)    | I              | N                                                 |
| Map — Custom styles (`CustomStyleExample`)            | I              | N                                                 |
| Map — Blank map (`BlankMapExample`)                   | I              | N                                                 |
| Controls — Map controls (`MapControlsExample`)        | I              | N                                                 |
| Markers — Custom markers (`MarkersExample`)           | I              | N                                                 |
| Markers — Draggable marker (`DraggableMarkerExample`) | I              | N                                                 |
| Markers — Layer markers (`LayerMarkersExample`)       | I              | N                                                 |
| Popups — Marker popups (`PopupExample`)               | I              | N                                                 |
| Popups — Standalone popup (`StandalonePopupExample`)  | I              | N                                                 |
| Routes — Routes and tooltips (`RouteExample`)         | I              | N                                                 |
| Routes — Route progress (`RouteProgressExample`)      | I              | N                                                 |
| Routes — OSRM routing (`OsrmRouteExample`)            | I              | N                                                 |
| Arcs — Arc connections (`ArcExample`)                 | I              | N                                                 |
| Arcs — Interactive arcs (`InteractiveArcExample`)     | I              | N                                                 |
| GeoJSON — Interactive regions (`GeoJSONExample`)      | I              | N                                                 |
| Clusters — Earthquake clusters (`ClusterExample`)     | I              | N                                                 |
| Advanced — Camera controls (`AdvancedUsageExample`)   | I              | N                                                 |
| Advanced — Custom layers (`CustomLayerExample`)       | I              | N                                                 |
| Advanced — Map overlays (`MapOverlayExample`)         | I              | N                                                 |

### Invalid routes and recovery states

These checks used one desktop appearance; responsive/theme/focus recovery testing is **N**. A generic 404 rendered is an inspected defect, not a passed recovery experience.

| URL                                                 | Rendered result                           | Coverage            |
| --------------------------------------------------- | ----------------------------------------- | ------------------- |
| `/docs/components/audit-missing`                    | Generic 404; F10                          | I render; P overall |
| `/docs/blocks/audit-missing`                        | Generic 404; F10                          | I render; P overall |
| `/docs/shaders/audit-missing`                       | Generic 404; F10                          | I render; P overall |
| `/templates/music-player/album/audit-missing`       | Generic 404; F10                          | I render; P overall |
| `/templates/video-library/title/audit-missing`      | Generic 404; F10                          | I render; P overall |
| `/templates/video-library/watch/audit-missing`      | Generic 404; F10                          | I render; P overall |
| `/templates/video-library/genres/audit-missing`     | Generic 404; F10                          | I render; P overall |
| `/templates/social-network/profile/audit-missing`   | Generic 404; F10                          | I render; P overall |
| `/templates/social-network/post/audit-missing`      | Generic 404; F10                          | I render; P overall |
| `/templates/social-network/post/local-123`          | Local post unavailable with timeline link | I render; P overall |
| `/templates/email-client/mail/audit-missing`        | Generic 404; F10                          | I render; P overall |
| `/templates/email-client/mail/inbox/audit-missing`  | Generic 404; F10                          | I render; P overall |
| `/demo/motion-route-prototype/detail/audit-missing` | Generic 404; F10                          | I render; P overall |
| `/audit-missing`                                    | Generic 404; F10                          | I render; P overall |

### Additional dynamic/query states and non-page endpoints

| State                                                | Coverage                                                                                                               |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `/templates/social-network/post/local-1791151428056` | I: created browser-local post and opened detail; P: other actions. This ephemeral ID is not a server registry entry.   |
| `/templates/video-library/search?q=tears`            | I: one matching title; P: all search/history interactions                                                              |
| `/templates/video-library/search?q=audit-no-match`   | I: empty result and guidance                                                                                           |
| `/templates/music-player?feedback=review`            | I: expanded after hydration; P: full workflow                                                                          |
| `/templates/music-player?feedback=developer`         | I: expanded after hydration; P: full workflow                                                                          |
| `/templates/music-player?feedback=off`               | I: collapsed after hydration; P: full workflow                                                                         |
| `/templates/video-library?feedback=review`           | I: expanded after hydration; P: full workflow                                                                          |
| `/templates/video-library?feedback=developer`        | I: expanded after hydration; P: full workflow                                                                          |
| `/templates/video-library?feedback=off`              | I: collapsed after hydration; P: full workflow                                                                         |
| `/templates/email-client?feedback=review`            | I: expanded after hydration; P: full workflow                                                                          |
| `/templates/email-client?feedback=developer`         | I: expanded after hydration; P: full workflow                                                                          |
| `/templates/email-client?feedback=off`               | I: collapsed after hydration; P: full workflow                                                                         |
| `/templates/social-network?feedback=review`          | I: expanded after hydration; P: full workflow                                                                          |
| `/templates/social-network?feedback=developer`       | I: expanded after hydration; P: full workflow                                                                          |
| `/templates/social-network?feedback=off`             | I: collapsed after hydration; P: full workflow                                                                         |
| `/docs/examples/[kind]/[slug]/source.json`           | I: valid preview/example source requests through all code frames; P: malformed kind/slug and every HTTP failure branch |
| `/docs/components/[slug]/source.json`                | P: source inventory; N: all download endpoint values/failures                                                          |
| `/docs/skills/bedrock-ui.md`                         | P: source/guide link inventory; N: standalone download headers/content verification                                    |

These endpoints are not counted as additional rendered application pages. User-generated IDs and free-text query domains are unbounded; seeded values plus named generated/empty/error cases are the finite audit inventory.

## 3. Available components and intended responsibilities

The registry exposes 127 documented components; the UI tree has 127 public `index.ts` entry points across 128 directories (including internal/grouping directories). The full registry with per-component descriptions is preserved in the inventory. The public layer is `#lib/bedrock/ui/*`; blocks provide recurring workflows, and templates own product data/routing.

| Responsibility          | Available Bedrock families                                                                                                                                                                                                                 | Audit implication                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Actions and links       | Button, Icon Button, Async Button, Link, Button Group, Toggle, Toggle Group                                                                                                                                                                | Preserve names, disabled semantics, pressed state, focus and shared motion. Styling a native anchor as a button needs the same contract.            |
| Content surfaces        | Card, Clickable Card, Selectable Card, Item, List, Separator, Aspect Ratio, Resizable                                                                                                                                                      | Card fits widgets/settings/gallery items; Clickable Card fits whole-card navigation with nested actions. Dense record lists remain Table/List/Item. |
| Fields and selection    | Input, Textarea, Field, Field Status, Label, Form, Native Select, Select, Selector, Multi Selector, Combobox, Checkbox/List, Radio Group, Switch, Input Group/OTP, Number/Phone/Date/Date Range/Date Time/Time/File inputs, color controls | Product validation belongs to the consumer; field/error associations and keyboard behavior belong to controls.                                      |
| Workflow and status     | Stepped Form, Stepper, Async Button, Progress, Spinner, Skeleton, Empty, Alert, Banner, Sonner, Status Dot                                                                                                                                 | Stepper is progress display, not form orchestration. Empty/loading/error states deserve explicit semantics; do not simply swap in Card.             |
| Navigation and overlays | Sidebar, Navigation Menu, Breadcrumb, Tabs, Outline, Pagination, Command, Dropdown Menu, Context Menu, Menubar, Popover, Hover Card, Tooltip, Dialog, Alert Dialog, Drawer, Sheet, Collapsible, Accordion                                  | Reuse focus/dismissal/selection contracts. URL-based documentation navigation is not automatically an ARIA tab widget.                              |
| Data and rich content   | Table, Data Table, Metadata List, Chart, Code Block, Diff, Markdown, PDF Viewer, Map, Image, Thumbnail, Video Player, Carousel, Lightbox, QR Code                                                                                          | Specialized behavior is legitimate. An event scheduling calendar is not a drop-in use of the date-picker Calendar.                                  |
| Type and inline content | Heading, Text, Blockquote, Badge, Token, Tokenizer, Kbd, Icon, Emoji, Avatar, Timestamp, Citation, Marker, Visually Hidden                                                                                                                 | Existing typography/status APIs reduce drift; icons and images do not supply missing accessible names automatically.                                |
| Conversation/feedback   | Chat, Message, Bubble, Attachment, Feedback                                                                                                                                                                                                | Product post/mail layouts remain custom compositions; preserve labels, local state and interaction boundaries.                                      |
| Decorative and motion   | Tilt Card, Spotlight, Marquee, Text Shimmer/Highlight, Animated Signature/Gradient, Light Rays, Shapes, Dot/Grid Pattern, Noise Overlay, Progressive Blur; shared motion policy, presence, layout and indicator helpers                    | Artwork may have its own geometry. Reduced-motion policy still applies to interactive decoration.                                                   |
| Blocks                  | Authentication Panel, Settings Section                                                                                                                                                                                                     | Already compose Card/Field/Input/Button. Pending, failure, retry and success were exercised.                                                        |

### Import-boundary result

No direct shadcn/Bits component imports were found in `src/routes`, `src/lib/site`, `src/lib/templates` or `src/lib/bedrock/blocks`. Bedrock UI implementations legitimately import Bits and frozen shadcn sources. Re-exports in `src/lib/bedrock/utils.ts`, `src/lib/bedrock/hooks/is-mobile.svelte.ts`, `src/lib/utils.ts` and `src/lib/hooks/is-mobile.svelte.ts` are compatibility plumbing, not accidental page-level bypasses. Third-party map/chart/media engines and ModeWatcher are also not duplicate UI controls.

## 4. Evidence-backed findings

### F01 — Theme-shaped Bedrock controls are surrounded by unthemed custom surfaces

**Severity:** P1, widespread design-system consistency. **States:** default, dark/light, theme override, focus/hover backgrounds and filtered-empty surfaces. The radius token may update while the curve remains round, so testing radius alone misses the defect.

Confirmed examples:

| Consumer and exact source                                                                                                        | Computed evidence                                                                                                                      | Suitable boundary                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `src/routes/docs/templates/+page.svelte:72` gallery articles; `:47` feedback aside; `:131` empty state                           | Gallery `28.8px / superellipse(1)`; standard Card is `22.4px / superellipse(3)`                                                        | Card/Clickable Card composition; Empty for the filtered-empty message; tokenized aside surface                |
| `src/routes/docs/shaders/+page.svelte:66` gallery links                                                                          | `22.4px / superellipse(1)` despite matching Card's radius                                                                              | Clickable Card if shader clipping remains valid; otherwise an explicitly theme-shaped link surface            |
| `src/lib/site/component-docs/ApiTable.svelte:9`; `AccessibilityTab.svelte:82`                                                    | API border frame `22.4px / superellipse(1)` alongside theme-shaped controls/cards                                                      | Shared documentation-table composition using Table and a themed scroll frame; **not Card around record data** |
| `src/lib/site/HeroPlayground.svelte:72`, `:101`, `:256`                                                                          | Four native `.surface` panels `14.4px / superellipse(1)`; `.surface` on Card `22.4px / superellipse(3)`                                | Card-based hero surfaces or a shared explicit surface recipe                                                  |
| `src/routes/templates/+layout.svelte:120`, `:148`                                                                                | Preview bar `14px / superellipse(1)`; popover theme-shaped; template links remain round                                                | Shared preview-controls composition and themed navigation items                                               |
| `src/lib/bedrock/ui/data-table/data-table.svelte:329`                                                                            | Measured `16px / superellipse(1)` in production; outer frame lacks a slot/theme utility although Table/control descendants use Bedrock | Shared DataTable frame; preserve nested scroll ownership                                                      |
| `src/lib/site/examples/button.svelte:15`, `dialog.svelte:17`, `input.svelte:9`, `phone-input.svelte:14` and the candidate ledger | Repeated rounded bordered example/settings surfaces outside the global slot selector                                                   | Reusable example/settings surface composed from Card where appropriate                                        |
| `src/routes/docs/forms/+page.svelte:131`, `:169`, `:178`, `:187`, `:228`                                                         | Native disclosure panels opt into radius but not theme shape                                                                           | Keep native details if appropriate; add the shared surface recipe                                             |

**Reproduce:** compare `/docs/templates`, `/docs/shaders`, `/docs/components/button?tab=properties` and `/` with a Card example; inspect `getComputedStyle(element).borderRadius` and `.cornerShape`. Temporarily set root `--corner-shape: bevel`: the Bedrock input follows it, gallery articles do not. `superellipse(1)` is Chromium's computed representation of round corners.

**Evidence:** [template gallery](ui-consistency-evidence/templates-1440-light.png), [shader gallery](ui-consistency-evidence/shaders-1440-light.png), [API table](ui-consistency-evidence/api-1440-light.png), [mobile homepage](ui-consistency-evidence/home-mobile-settled.png), [template switcher](ui-consistency-evidence/template-switcher.png), [token override](ui-consistency-evidence/template-theme-override.png), `detail-styles.json`, `interactions.json` and `shared-final.json`.

**Confirmed cause:** `src/lib/bedrock/styles.css:136` applies `corner-shape` to `[data-slot]`; the `corner-theme` utility at `:148` is opt-in. The custom elements above have neither. `HeroPlayground` also demonstrates scoped CSS not uniformly styling a component's internal root: a shared class name is not proof of a shared surface implementation.

**Fix scope/risk:** shared compositions first, then consumers. Do not add a blanket rule to every `div` or every class containing `rounded`. Preserve circles/pills and decorative artwork. `src/lib/site/ExampleCard.svelte:91–95` deliberately uses `corner-round` because superellipse clipping breaks descendant backdrop masks in Chromium; preserve that documented exception until separately validated. Recheck nested image corners, overlay clipping, focus outlines and scrollbars after adopting Card/Clickable Card.

### F02 — Custom homepage tilt continues under reduced motion

**Severity:** P1 accessibility/motion. **Affected:** `/`, desktop pointer and focus-within states; OS reduced motion enabled.

**Reproduce:** enable reduced motion, open the homepage at 1440px, move the pointer across the component constellation. The scene still rotates and hover cards still translate/scale. The recording was captured with `matchMedia('(prefers-reduced-motion: reduce)').matches === true`.

**Evidence:** [short recording](ui-consistency-evidence/hero-reduced-motion.webm), [left position](ui-consistency-evidence/hero-reduced-left.png), [right position](ui-consistency-evidence/hero-reduced-right.png). `.world` changed from a matrix containing rotation terms `0.0588741 / 0.0323102` to `-0.0471846 / -0.0433469` while the preference stayed true.

**Confirmed cause:** `src/lib/site/HeroPlayground.svelte:28–35` updates rotation for every non-touch pointer; `:231` applies it; hover/focus transforms at `:268–300` remain active. Its reduced-motion rule at `:342` removes interpolation duration, not displacement. This duplicates behavior already policy-gated in `src/lib/bedrock/ui/tilt-card/tilt-card.svelte:27–57`.

**Recommended location:** page's shared hero composition. Use Bedrock's motion policy to disable/reset tilt and lift transforms, or compose TiltCard when its behavior fits. **Capability gap:** TiltCard exposes one `maxTilt`, whereas this scene uses asymmetric axes and independently positioned planes; do not force a drop-in replacement that loses that composition. Regression checks: live preference changes, keyboard focus, touch, pointer exit and non-reduced decoration.

### F03 — Demo compositions escape the mobile viewport

**Severity:** P1 responsive usability. **Affected:** `/demo/erp`, `/demo/motion/continuity`, `/demo/motion-test`; 390px viewport, both themes. These are distinct constraints, not proof of a shared Table defect.

| Route                 | Settled document width | Source / cause and repair boundary                                                                                                                                                                                                                                                                   |
| --------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ERP                   | 446px                  | `src/routes/demo/erp/+page.svelte:343–344`, `:397`, `:412`, `:424`: the secondary grid/compositions retain min-content width. Four attachments and chat extend beyond the viewport. Confirm the exact minimum-size contributor before patching; page-level constraints are the initial fix location. |
| Continuity lab        | 756px                  | `src/routes/demo/motion/continuity/+page.svelte:411` `.page-stack` grid and nested benchmark content; shared `src/lib/site/motion-lab/Benchmark.svelte` participates. The measured stack is about 740px wide inside the narrow content area. The precise contributing child remains a hypothesis.    |
| Motion stress fixture | 568px                  | `src/routes/demo/motion-test/+page.svelte:2` delegates to `src/lib/bedrock/motion/motion-stress-fixture.svelte`; its stress grid sets `width: 552px` at `:65`, wider than the viewport. Bound the fixture's scroll region without changing the experiment's item geometry.                           |

**Reproduce:** set 390px width, wait for layout to settle, compare `document.documentElement.scrollWidth` to `innerWidth`, then scroll to the lower content. **Evidence:** [ERP](ui-consistency-evidence/erp-390-light.png), [ERP bottom](ui-consistency-evidence/erp-mobile-bottom.png), [continuity](ui-consistency-evidence/continuity-390-dark.png), [stress fixture](ui-consistency-evidence/stress-390-light.png), `detail-styles.json` and the overflow-node list in `state-checks.json`.

**Recommended components/tokens:** use existing ScrollArea/Table local scrolling and `min-w-0`/`minmax(0,1fr)` layout constraints where measurements justify them; no new primitive is needed. Do not hide the problem with `body { overflow-x: hidden }`. Preserve data-table horizontal scrolling and resize handles. Verify 320/390/768px, all tab views, attachments, long text and keyboard reachability.

### F04 — Template-local color/opacity overrides lower contrast

**Severity:** P1 for calendar date legibility; P2 for video secondary text. **Affected:** email calendar in dark mode; all video pages with account/header/footer chrome.

| Element                              | Verified contrast                             | Exact source                                                                                           |
| ------------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Clickable out-of-month calendar date | 2.37:1, rendered `#4e4e4e` on `#0a0a0a`, 11px | `src/lib/templates/email-client/calendar-screen.svelte:480–482`: muted foreground plus `opacity: 0.45` |
| Video account initials               | 3.66:1, white on `#bd725c`, 11px bold         | `src/routes/templates/video-library/frame.css:167–177`                                                 |
| Video footer copy                    | 4.37:1, `#797982` on `#111113`, 9–10px        | `src/routes/templates/video-library/frame.css:552`                                                     |

These controls/text are not disabled. Their measured small-text requirement is 4.5:1. **Reproduce:** open calendar, enable dark mode, inspect the enabled “Monday, 31 August 2026” day; inspect the video account initials and scroll to its footer. [Calendar evidence](ui-consistency-evidence/calendar-contrast.png), [video header evidence](ui-consistency-evidence/video-contrast.png), [video footer evidence](ui-consistency-evidence/video-footer-contrast.png), and the URL/theme-verified `confirmed-contrast-and-name` results in `workflows.json` provide the measurements.

**Confirmed cause:** local opacity and literal colors override the readable pairings supplied by shared tokens. **Fix location:** template theme/composition. Use a sufficiently contrasting scoped semantic token and avoid multiplying muted text by opacity. Avatar/Fallback can supply account semantics, but still needs a valid brand color pairing. Calendar is an event scheduler; Bedrock's date-picker Calendar is **not** a suitable replacement. Test selected/today/outside/hover/focus combinations and both themes; retain the product's brand palette.

### F05 — Template styling creates parallel control geometry

**Severity:** P2 consistency. **Affected:** all four templates and their shared preview bar; examples confirmed in music/social/video navigation, buttons and search.

**Evidence:** music navigation `8px / superellipse(1)` versus its Bedrock buttons' theme shape; social navigation remains round while the Post button computes `24px / superellipse(3)`; video action anchors are `4px / superellipse(1)`. The preview bar is `14px / superellipse(1)` while its Popover is theme-shaped. See [social](ui-consistency-evidence/social-1440-light.png), [music](ui-consistency-evidence/music-1440-light.png), [video](ui-consistency-evidence/video-1440-light.png), and `detail-styles.json`.

**Exact sources:** `src/routes/templates/music-player/+layout.svelte:391` navigation radius and `:635` circular control styles; `src/lib/templates/music-player/CollectionGrid.svelte:35`; `src/routes/templates/social-network/social.css:79–119` navigation/action recipes; `src/routes/templates/video-library/frame.css:293–307` action recipe; `src/lib/templates/email-client/productivity-workspace.svelte:243–299`; shared `src/routes/templates/+layout.svelte:148–162`.

**Confirmed cause:** templates mix native links/panels and public Bedrock controls, with local fixed-radius/color/typography rules. Slot-bearing controls acquire `--corner-shape`; neighboring custom elements do not. Fixed radii do not follow the root radius scale. A product-specific palette and cinematic type are legitimate; the failure is the absence of a coherent, explicit theme boundary across related controls.

**Recommended location:** shared per-template composition/theme, then consumers. Scope semantic Bedrock tokens to each template; use Sidebar/MenuButton or a shared navigation-item composition where their behavior fits, Button `href` for action links, and explicit `corner-round` for intended pills/circles. Keep editorial media layouts and the cinematic video palette. **Uncertainty:** video intentionally declares `color-scheme: dark` (`frame.css:9`); the global toggle changes the preview controls but not that canvas. Clarify/document this product exception rather than assuming that recoloring the film stage is required. Test portaled popovers: a theme set only on a subtree may not reach a portal mounted outside it.

### F06 — Video floating navigation panels do not share dismissal behavior

**Severity:** P2 usability. **Affected:** all video routes except the dedicated watch screen; Genres and Your account menus, expanded keyboard/outside-click states.

**Reproduce:** open `/templates/video-library`, expand Genres, press Escape, then click the brand outside the panel. The details element remains open. A Bedrock Popover used by the adjacent template switcher closes on Escape. **Evidence:** `interactions.json` records `escapeStaysOpen: true` and `outsideStaysOpen: true`; [open panel screenshot](ui-consistency-evidence/video-menu-open.png).

**Confirmed cause:** `src/routes/templates/video-library/+layout.svelte:86–99` and `:127–142` use native `<details>` as absolutely positioned floating menus. They only remove `open` when a genre link is selected. Native details is appropriate for inline disclosure, but does not implement this overlay contract.

**Existing fit:** DropdownMenu Trigger/Content/Item with link children and labels/separators. **Fix location:** video shared layout. Preserve ordinary links, browser history, account header and non-modal behavior. Acceptance: Escape/outside dismissal, focus return, keyboard traversal and only one active panel, in both viewport sizes. Avoid adding another page-local keyboard/outside-click handler.

### F07 — Shared navigation uses invalid framework options

**Severity:** P2 diagnostics and navigation-policy uncertainty. **Affected:** all 127 component docs pages/tabs; all template routes.

**Confirmed sources:** `src/lib/site/component-docs/ComponentTabs.svelte:65` has `data-sveltekit-reload="off"`; `src/routes/templates/+layout.svelte:52` has `data-sveltekit-preload-data="off"`. Installed SvelteKit accepts `""`, `"true"`, `"false"` for reload, and `""`, `"false"`, `"tap"`, `"hover"` for preload data.

**Reproduce/evidence:** navigate between Overview, Properties and Accessibility and inspect the development console. Repeated “Unexpected value for reload” messages were captured throughout the route sweep and `interactions.json`; template navigation also reported the invalid preload value. This is a confirmed invalid attribute, **not proof that every navigation fails**. A hydrated bottom-of-page Outline check selected Examples correctly; sidebar navigation/back restored the measured 1470px scroll position in `workflows.json`.

**Fix location:** two shared compositions, using valid framework values consistent with the chosen navigation policy. No UI primitive change required. The skill's historical full-reload workaround and current SPA code disagree; do not remove or reintroduce that workaround blindly. Verify production SPA navigation, teardown, history and scroll before changing the intended policy. URL-based component-doc links are valid navigation; do not replace them with Tabs solely to eliminate custom markup.

### F08 — Development Form preview fails at the Superforms compatibility boundary

**Severity:** P2 development blocker (production scope explicitly limited). **Affected:** `/docs/components/form`, lazy variants/example; development preview at port 4513.

**Reproduce:** load Form in the current development preview and wait for the example. `superForm` reaches the removed `$app/stores` subscription; Code/Preview controls remain disabled or the page reloads. **Evidence:** [development screenshot](ui-consistency-evidence/form-runtime-error.png), [console](ui-consistency-evidence/form-console.json), route sweep diagnostic; [production results](ui-consistency-evidence/production.json) show the Form page and both tabs load with zero recorded errors and zero disabled documentation tabs.

**Source entry points:** `src/lib/site/previews/form.svelte:5,20`, `src/lib/site/examples/form.svelte:5,20`; the narrow compatibility transform is `vite.config.ts:50–65`, and the store adapter is `src/lib/site/superforms-stores.ts`. **Confirmed:** the development browser executed the removed store implementation. **Hypothesis:** the development dependency optimizer/current running server did not apply the intended adapter consistently; a cache/configuration mismatch is plausible. The audit did not restart or repair the user's development server to hide this failure.

**Fix location:** development integration/build boundary, then the shared lazy-error boundary if necessary. Keep the public Form wrapper; changing it to native fields would conceal the compatibility issue. Acceptance: clean development startup and lazy navigation to Form work repeatedly; source tabs, field validation and production static output still pass. Regression risk: broad module aliasing could change unrelated SvelteKit consumers.

### F09 — Persistent music artwork link lacks a name

**Severity:** P2 accessibility. **Affected:** every music-player route, keyboard and assistive-technology navigation.

**Confirmed cause:** `src/routes/templates/music-player/+layout.svelte:187–190` wraps an `alt=""` image in a link without link text, `aria-label` or `aria-labelledby`. The adjacent track title is outside that anchor. **Reproduce:** tab to the player artwork; inspect its accessible name. The URL/theme-verified axe run flags `.playing > a` as `link-name`. [Screenshot](ui-consistency-evidence/music-link.png), `workflows.json`.

**Fix location:** shared persistent-player composition. A native anchor is legitimate; give it a name such as the destination album, or compose Link/Thumbnail with an explicit accessible label. **Missing capability:** no wrapper can infer the correct destination label from decorative album art. Preserve the separate like button and avoid nested interactive controls. Check every collection and the mobile player layout.

### F10 — Error pages do not reuse a Bedrock recovery composition

**Severity:** P2 consistency/usability. **Affected:** invalid component/block/shader/album/film/genre/profile/post/mail/prototype parameters and unmatched routes; see the error-state checklist.

**Reproduce:** open `/docs/components/audit-missing`. The page contains “404 / Component not found”, a blank document title, and no Bedrock navigation/recovery action. **Evidence:** [404 screenshot](ui-consistency-evidence/error-404.png) and `missing-routes` results in `interactions.json`. The same fallback pattern was checked across the invalid parameter families.

**Confirmed cause:** there is no `src/routes/+error.svelte` or nested `+error.svelte`; loaders correctly throw errors, but SvelteKit's generic fallback owns presentation. Example throw sites: `src/routes/docs/components/[slug]/+page.server.ts:14`, `src/routes/templates/music-player/album/[slug]/+page.ts:8`, `src/routes/templates/email-client/mail/[folder]/[[message]]/+page.ts:10–12`.

**Existing fit:** Empty/Heading/Text/Button in a shared recovery composition; optionally a route-specific title/message. **Fix location:** shared error layout/page, not each loader. Preserve HTTP status, distinguish not-found from unexpected errors, and never expose raw exceptions. Test direct navigation, client-side failure, theme, narrow width and recovery/back links. Error message semantics must not depend solely on a decorative illustration.

### F11 — Shared Tooltip renders without an accessible description relationship

**Severity:** P2 shared accessibility defect. **Confirmed routes/states:** `/docs/components/tooltip`, pointer hover and keyboard focus, in both the current development preview and production. Tooltip text is visible and Escape dismisses it, but the relationship used to expose that text as the trigger's description is missing.

**Reproduce:** hover “Hover me”, then inspect its `aria-describedby` and the visible `[data-slot="tooltip-content"]`. The trigger has `aria-describedby=""`; the content has an empty ID and no `role="tooltip"`. Repeat with keyboard focus. `getByRole('tooltip')` cannot find it even though the screenshot shows the content. **Evidence:** [production screenshot](ui-consistency-evidence/tooltip-semantics-4850.png), [development screenshot](ui-consistency-evidence/tooltip-semantics-4513.png), and [DOM/state evidence](ui-consistency-evidence/tooltip-select-retry.json). This was a real semantic defect behind an initial role-based test timeout, not a visual-open failure.

**Exact ownership:** `src/lib/bedrock/ui/tooltip/tooltip-content.svelte:21–26` forwards to `src/lib/shadcn/ui/tooltip/tooltip-content.svelte:24–33`, which composes Bits content. The reproduction is `src/lib/site/previews/tooltip.svelte:6–12`. **Confirmed cause at the DOM boundary:** no content ID exists for the trigger's description reference. **Unresolved root cause:** the precise prop/ID loss in the installed Bedrock → frozen wrapper → Bits/popover pipeline was not isolated. Do not attribute it to the motion attachments without a minimal reproduction; those attachments source-code checks do not establish that they remove IDs or roles.

**Affected-consumer inventory:** tooltip preview and example (`src/lib/site/examples/tooltip.svelte:23`); `/demo/component-motion` through `src/lib/site/guide-examples/motion-families.svelte:75`; `/demo/motion/components` at `:225`; `/demo/erp` at `:286`; IconButton's tooltip branch in `src/lib/bedrock/ui/icon-button/icon-button.svelte:61–70`, used by `/docs/components/icon-button` (`src/lib/site/previews/icon-button.svelte:6`), email archive/delete (`src/lib/templates/email-client/email-client.svelte:552,558`) and music Lyrics/Visualizer (`src/routes/templates/music-player/+layout.svelte:283,291`). These consumers share the implementation but their tooltip DOM was **not individually re-probed**. IconButton retains its own `aria-label`; this finding does not claim every affected action is unnamed.

**Existing fit / fix location:** retain Bedrock Tooltip; repair its shared integration contract rather than adding IDs and hover handlers at each consumer. No new primitive is needed. Acceptance: an open tooltip has a unique ID and tooltip role, its trigger references that ID, the relationship works on hover and keyboard focus, Escape dismisses it, and retained exits do not expose duplicate hidden semantics. Test multiple simultaneous instances, nested providers and live motion-policy changes. Regression risk: duplicating IDs or competing presence ownership if patched at the wrong layer.

## 5. Reuse decisions and missing capabilities

| Current custom UI                           | Suitable Bedrock component/composition                                                | Missing capability or important constraint                                                                                                            |
| ------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gallery articles and whole-card links       | Card + Clickable Card                                                                 | Preserve nested review/annotate actions and shader/media clipping. Test stretched-link stacking before migration.                                     |
| Repeated example/settings panels            | Card parts or a small shared example-surface composition                              | Card's default spacing may need an explicit variant; not every bordered layout is a Card.                                                             |
| API/accessibility HTML tables               | Table family + themed horizontal scroll frame                                         | Preserve row-header `<th scope="row">`, min widths, code wrapping and column semantics. Do not replace with interactive DataTable unnecessarily.      |
| DataTable's custom outer frame              | Existing frame with `corner-theme` or a stable slot                                   | No Card wrapper; keep local scrolling.                                                                                                                |
| Tooltip content/trigger relationship        | Keep Tooltip; repair shared ID/role forwarding                                        | Exact loss point needs isolation; do not fork hover/focus logic into consumers.                                                                       |
| Native video floating details menus         | DropdownMenu                                                                          | Link children and static account labels are supported; dismissal/focus behavior is already available.                                                 |
| Template action links                       | Button with `href`                                                                    | Brand appearance should be a scoped token/variant, not repeated literal overrides.                                                                    |
| Music/social/email sidebar items            | Sidebar/MenuButton or a shared product navigation-item composition                    | Preserve product shell sizing, fixed player, mobile tabs and real URLs. Sidebar is not automatically a drop-in replacement for every shell.           |
| Homepage pointer tilt                       | TiltCard or existing motion-policy helpers around the custom scene                    | Current TiltCard does not express independently floating planes or separate X/Y tilt limits.                                                          |
| Copied loading/error/empty panels           | Skeleton/Spinner, Empty, Alert/FieldStatus as appropriate                             | Loading text must be announced; real remote failure/validation data stays in the consumer.                                                            |
| Custom DataTable view strip                 | Consider Tabs/ToggleGroup composition after reviewing behavior                        | One shared filtered table is not several independent panels. Preserve immediate filtering and counts; no forced migration solely for code similarity. |
| URL-based component documentation tabs      | Keep link navigation; share indicator/focus styling                                   | Bedrock Tabs handles in-page panels, not URL/history semantics by itself.                                                                             |
| Calendar event grid                         | Keep scheduler composition; reuse Button/Dialog/DateInput                             | Bedrock Calendar is a date picker, not a full event scheduler.                                                                                        |
| Social posts, film rails, music collections | Keep product-specific composition; reuse controls, media and token recipes            | Do not turn every post/record into Card. Film aspect ratios and editorial artwork are legitimate.                                                     |
| Native forms-source details                 | Native disclosure + shared surface recipe, or Collapsible if its controlled API helps | Native keyboard semantics are valid. The defect is theme omission, not the presence of `<details>`.                                                   |
| ExampleCard's intentionally round frame     | Keep current explicit `corner-round`                                                  | Known Chromium backdrop clipping exception; do not normalize blindly.                                                                                 |
| Default route errors                        | Shared Empty/Heading/Text/Button recovery view                                        | Needs route-aware copy and HTTP error state, owned outside primitives.                                                                                |

## 6. Prioritized repair batches

Repairs are **proposed only** and require review of this audit before implementation.

**Shared primitive prerequisite (F11):** isolate and repair Tooltip ID/role forwarding in `src/lib/bedrock/ui/tooltip/tooltip-content.svelte` and its frozen wrapper/Bits integration before touching the listed consumers. Require the hover/focus/description/Escape acceptance checks from F11. This takes precedence over page-specific visual patches; avoid editing the frozen upstream tree until the boundary is understood.

| Batch                                                 | Files / scope                                                                                                                                                                                                                      | Acceptance criteria                                                                                                                                                                                                | Regression risks                                                                                                                                            |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 — Shared surface contract                           | `src/lib/site/component-docs/ApiTable.svelte`, `AccessibilityTab.svelte`, `src/lib/bedrock/ui/data-table/data-table.svelte`, `src/routes/templates/+layout.svelte`; add a shared composition only where multiple consumers need it | Computed radius and corner-shape match the chosen recipe; root `--radius` and `--corner-shape` changes propagate; desktop/mobile light/dark and focus/hover/selected states pass.                                  | Superellipse clipping, portal themes, nested focus rings and scrollbars. Preserve ExampleCard exception.                                                    |
| 2 — Surface consumers                                 | `src/routes/docs/templates/+page.svelte`, `src/routes/docs/shaders/+page.svelte`, `src/lib/site/HeroPlayground.svelte`, `src/routes/docs/forms/+page.svelte`, confirmed example consumers in candidate ledger                      | Migrate semantic cards to Card/ClickableCard; explicitly theme legitimate custom surfaces; inventory every touched consumer, including empty states.                                                               | Stretched-link hit areas, card padding, native disclosures, shader/backdrop rendering.                                                                      |
| 3 — Accessibility fixes                               | `HeroPlayground.svelte`, `calendar-screen.svelte`, video `frame.css`, music `+layout.svelte`                                                                                                                                       | Reduced motion freezes decorative tilt, including live preference changes; measured text contrast meets requirement; artwork link has a useful name.                                                               | Losing visual hierarchy, hover transforms still active, album/player nested actions.                                                                        |
| 4 — Responsive compositions                           | ERP `+page.svelte`, continuity `+page.svelte`, `motion-lab/Benchmark.svelte` if implicated, `motion-stress-fixture.svelte`                                                                                                         | At 320/390/768px, page width does not exceed viewport; intended local scroll regions remain usable with keyboard/touch; repeat empty/data/expanded states.                                                         | Accidentally clipping test fixtures, attachment actions, resizing and data-table columns. Resolve min-content root causes before editing shared primitives. |
| 5 — Template theme/navigation consolidation           | Music/social/email shared shells and CSS; video `+layout.svelte` / `frame.css`; shared preview controls                                                                                                                            | Related navigation/action surfaces share explicit scoped tokens and intended corner geometry; floating menus dismiss and restore focus; portal colors match.                                                       | Changing brand identity, media layout, route/history behavior, fixed player/preview control overlap.                                                        |
| 6 — Runtime/navigation and recovery                   | `ComponentTabs.svelte`, templates `+layout.svelte`, `vite.config.ts`, `superforms-stores.ts`, add shared `+error.svelte` composition                                                                                               | No invalid-option console diagnostics; Form works from clean dev and production; default errors provide accessible recovery; history/scroll/TOC remain correct.                                                    | Reintroducing known teardown races, broad compatibility aliases, masking actual errors.                                                                     |
| 7 — Close coverage gaps and enforce regression checks | Existing component/e2e fixtures and the audit checklist                                                                                                                                                                            | Exercise every still-partial relevant state; add focused semantic/visual regressions for confirmed defects, not tests mirroring implementation. Resolve or explicitly quarantine the existing server-test failure. | A green broad smoke run must not be mistaken for full keyboard, contrast, motion or assistive-technology coverage.                                          |

## 7. Verification, exclusions and remaining uncertainty

- `pnpm check`: **passed**, zero errors and warnings. [Log](ui-consistency-evidence/typecheck.log).
- `pnpm exec vitest run --project server`: **267 passed, 1 failed** across 51 files. The failure is `src/lib/bedrock/motion/policy.test.ts:138`, “warns when vanish cannot preserve a stable local containing block”; expected warning was not called. This is an existing observed baseline failure, not a repaired test. [Log](ui-consistency-evidence/server-tests.log).
- `pnpm exec vite build`: **passed** with adapter/deprecation/performance warnings. This invokes the build directly, intentionally avoiding `reference:generate`, which could rewrite application reference data during an audit. [Log](ui-consistency-evidence/build.log).
- Targeted production browser smoke: Form overview/properties/accessibility, forms guide, Button and all four template roots/calendar, with no recorded page errors. This is **not** production coverage of every route/state.
- The broad runtime source is the existing dev preview, so development-only feedback UI and diagnostic messages are included. An application runtime failure is not automatically attributable to a design-system primitive.
- Contrast checks cover the confirmed pairs described above, not all text/images/translucent overlays. Screenshot appearance alone is not a contrast calculation.
- An initial music-search contrast scan returned 4.29:1; a later settled computed-style check returned the shared `oklch(0.556 0 0)` token. The transient color/timing cause was not established, so this is an unresolved measurement, not another confirmed contrast finding. The initial loading-example ARIA warning likewise needs a controlled delayed-load reproduction.
- No full screen-reader, forced-colors, RTL, 200% text zoom, Safari/Firefox, physical touch-device, drag-and-drop or upload matrix was completed. Unsupported `corner-shape` fallback was source-reviewed, not tested in a second engine.
- Not every primitive's complete value domain, nested overlay combination, rapid interruption sequence, loading delay, remote-media failure or empty dataset was exercised. Route-default breadth and shared depth are explicitly separated in the checklist.
- Broad-pass diagnostics: 380 invalid-reload messages, 88 invalid-preload messages, 138 `derived_inert` warnings and 3 `ownership_invalid_binding` warnings (motion components and Range Calendar), plus four GPU-stall messages and the Form compatibility error. Counts include repeated states and the documented contaminated attempt. Ownership/derived/GPU warnings were recorded but not individually root-caused. There were zero recorded page-error events or HTTP ≥400 responses on the 258 normal-route visits, and 32 failed requests, all `net::ERR_ABORTED`; this does not negate the console-caught Form failure.
- Failed-request logs include aborted navigation/unmounted resources; these are not automatically broken assets. External map/media availability remains environment-dependent. All 22 map variants rendered, but that does not prove every remote layer/route/marker interaction worked.
- No real email, feedback message or external post was sent. Template task/post experiments used browser-local demo state in isolated audit sessions.
- Full client-unit and existing Playwright suites were not run; the server suite and targeted real-browser audit are the checks actually completed. Report Markdown formatting, link existence, route-table membership and gzip integrity were checked separately.
- Application code was not changed. The report and evidence are review artifacts; no repair, commit or deployment was performed.
