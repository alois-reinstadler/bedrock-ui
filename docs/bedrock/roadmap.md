# Bedrock Roadmap

**Status:** Authoritative sequencing document

**Last updated:** 2026-08-30

**Companion:** [Bedrock backlog](./backlog.md)

**Current verification:** [M0 verification baseline](./verification-baseline.md)

**Motion verification:** [M1 hardening evidence](./motion-verification.md)

**Motion implementation record:** [Layout animations plan](../superpowers/plans/2026-08-29-layout-animations.md)

## Purpose

Bedrock grows outward from stable foundations. Motion is preserved and hardened first; semantic primitives, application structure, forms and data follow in deliberate layers. This roadmap defines the order, dependencies and exit gates. It does not authorize a broad rewrite of the existing component catalogue.

The repository documents are the source of truth for architectural decisions, milestone acceptance criteria and explicit deferrals. Conversation and prototypes may inform them, but do not replace them.

## Working principles

1. Stabilize before expanding. A red type-check or test baseline is milestone work, not background noise.
2. Write a component contract before implementing the component.
3. Compose higher-level patterns from Bedrock foundations; do not duplicate their APIs or semantics.
4. Keep the public API semantic and intentionally narrow. Avoid general-purpose CSS-prop façades.
5. Preserve the motion lab as an integration fixture. It is not a substitute for automated browser coverage.
6. Graduate existing component families only when a foundation or product pattern needs them.
7. Treat accessibility, reduced motion, internationalization, responsive behavior and performance as contract concerns.
8. Preserve the Astryx-aligned semantic motion presets as the M1 seed vocabulary; change a value only through a recorded decision backed by fixture evidence.

## Maturity ladder

Every component family has one explicit maturity level.

| Level | Name                         | Meaning                                                                                                         |
| ----- | ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1     | Generated Shadcn component   | Registry-derived implementation with local styling; no Bedrock stability promise.                               |
| 2     | Bedrock compatibility façade | A narrow Bedrock-facing API that isolates consumers from generated internals while migration is underway.       |
| 3     | Hardened Bedrock component   | Documented semantic contract, token integration and required unit, browser, accessibility and visual coverage.  |
| 4     | Product-level pattern        | A composed workflow or application pattern built from hardened components and validated by a real product need. |

The roughly 55 existing component families do **not** advance as a batch. A family graduates only when a named foundation, milestone deliverable or real product pattern requires it. Graduation must have an owner, a written contract and acceptance evidence. Unused families remain at their current level.

## Milestone map

| Milestone   | Deliverable                             | Depends on                           | Exit condition                                                                                                                                                          |
| ----------- | --------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M0          | Architecture records and green baseline | Current motion prototype             | Planning documents reflect the implementation; verification failures are inventoried; `pnpm check` and current tests pass.                                              |
| M1          | Motion foundation                       | M0                                   | The public motion contract is settled, browser scenarios pass, reduced motion is enforced, performance limits are measured and dropped flushes warn in development.     |
| M2          | Semantic foundations                    | M1                                   | Foundation tokens and semantic primitives have approved contracts and required verification; no primitive is a general CSS-prop escape hatch.                           |
| M3          | `PageLayout` and `AppShell`             | M2                                   | A responsive, accessible application shell is composed entirely from Bedrock foundations and remains semantically correct without motion.                               |
| M4          | `FormLayout`                            | M2; normally validated inside M3     | Native Svelte forms and existing Superforms usage can share the same field, validation, pending and action layout contracts without either integration being mandatory. |
| M5          | Data table system                       | M2; M3 for application-level fixture | The initial table feature pack works in client- and server-controlled modes with Bedrock-owned markup, accessibility and state presentation.                            |
| Later       | Templates, blocks and machine discovery | Proven product patterns              | Started only after stable patterns justify packaging or discovery.                                                                                                      |
| Conditional | AI/chat family                          | A real Bedrock consumer              | Started only when a consumer needs streaming chat, citations or tool-call rendering.                                                                                    |

Milestones are sequential where a dependency is named. M4 and M5 may proceed independently after their shared foundations are stable, but neither should weaken the green baseline.

## M0 — Decisions and green baseline

M0 is documentation and stabilization only. It must not become a large component implementation.

### Deliverables

- Authoritative roadmap, foundations, component-contract, motion-contract and backlog documents.
- Reconciled motion plan that describes the current 14-scene lab and implemented public behavior.
- An inventory that separates project-wide import/documentation-site failures from motion-specific failures and records whether previously reported diagnostics remain reproducible.
- A deliberate checkpoint for the current motion work before further dependencies are added. A commit occurs only when explicitly requested.

### Checklist

- [x] Reconcile the motion implementation plan with the current engine.
- [x] Record the foundation taxonomy and component contract.
- [x] Inventory every current `pnpm check` failure by cause and ownership.
- [x] Re-run the reported `/demo/ui` cached shared-attachment diagnostic; it is absent from the current checkpoint, so no fix is required unless it recurs.
- [x] Resolve the remaining project-wide type-check failures.
- [x] Run `pnpm check` successfully.
- [x] Run the current test suite successfully.
- [x] Record the exact verification commands and results in the [verification baseline](./verification-baseline.md).

### Exit gate

The plans match reality, all known verification failures have an owner or are resolved, and the existing check and test commands are green. M1 does not begin from a waived red baseline.

## M1 — Motion foundation

The custom FLIP engine remains the Bedrock layout primitive. M1 defines and tests its production boundary rather than replacing it.

### Contract decisions to settle

- Supported discrete layout, packing, shared-element and size scenarios.
- The v1 no-nested-projection rule.
- Behavior when `layout()` is used outside `LayoutGroup`.
- Shared IDs across mount/unmount and across group boundaries.
- Interruption, cancellation and retargeting behavior.
- Window scroll and nested-scroll-container behavior.
- Reduced-motion behavior.
- SSR and hydration behavior.
- Observer and measurement cost, plus a recommended group-size ceiling.
- Continuous CSS transitions versus discrete layout changes.
- Why `reveal` may animate height while the FLIP engine remains transform-only.
- Logical positioning and RTL implications of `vanish`.
- Public exports and motion tokens for duration, easing, spring presets and distance.

### Required verification

- [ ] Browser component test for a layout flush.
- [ ] Interruption and retargeting test.
- [ ] Shared-ID transfer test.
- [ ] Reduced-motion test.
- [ ] Window and nested-scroll test.
- [ ] Removal and insertion test.
- [ ] Performance fixture with 50–100 registered nodes.
- [ ] Development warning when the flush-rate guard silently drops an update.
- [ ] SSR and hydration fixture.
- [x] Browser console and network checks for the motion lab.

### Exit gate

The motion contract, tests, measured performance envelope and development diagnostics agree. The 14-scene `/demo/ui` lab remains an exploratory and integration surface; its raw controls may be replaced with Bedrock primitives only after M2.

## M2 — Semantic foundations

### Token taxonomy

- Semantic surface, text, border, accent and status colors.
- Hover, pressed, selected and disabled interaction overlays.
- Spacing and density.
- Control sizes and tap targets.
- Typography roles.
- Role-based radii.
- Borders and elevation.
- Focus treatment.
- Layer and z-index levels.
- Motion.
- Responsive and container behavior.
- Data-visualization colors.

### Initial primitives

- Content: `Text`, `Heading`, `Link`, `Icon`, `VisuallyHidden`.
- Layout: `Stack`, `HStack`, `VStack`, `Grid`, `Center`, `Section`.
- Structure: a semantic `Layout` or `PageLayout` surface with header, content, panel and footer slots.

`Text` exposes roles and semantic elements, not arbitrary Tailwind properties. `Stack` exposes direction, gap, alignment and wrapping, not an unrestricted CSS-property API.

### Exit gate

Each primitive has the structured Bedrock component contract, uses the approved token taxonomy and passes its defined unit, browser, accessibility and visual checks.

## M3 — `PageLayout` and `AppShell`

`AppShell` composes the APIs and semantics of:

- `TopNav`
- `SideNav`
- `MobileNav`
- `PageLayout`
- a skip link
- the main-content landmark
- an optional utility or secondary panel

Motion may support navigation collapse and panel resizing, but shell semantics, focus order and navigation remain complete when motion is disabled or unavailable.

### Exit gate

The shell is responsive, landmark-correct, keyboard-operable and composed from hardened Bedrock foundations. It does not duplicate lower-level navigation or layout contracts.

## M4 — `FormLayout`

The initial scope includes:

- Vertical and horizontal field arrangements.
- Field groups and fieldsets.
- Required and optional indicators.
- Description, warning, error and success messages.
- A form-level validation summary.
- Pending and submitting states.
- Primary and secondary actions.
- Responsive label placement.
- Async validation and server errors.

The contract integrates with native Svelte forms and the existing Superforms integration without requiring either one.

### Exit gate

The same semantic field and message structure works with both integration styles, including focus transfer from the validation summary, accessible pending state and responsive label layout.

## M5 — Data table system

The target architecture uses the official TanStack Svelte adapter for Table v9:

- TanStack owns headless state and row processing.
- Bedrock owns semantic markup, accessibility, density, visuals and interaction contracts.
- A Bedrock `createTableHook` preset establishes shared features and conventions.
- Raw table parts remain independently composable.

As verified on 2026-08-30, the [official Svelte quick start](https://tanstack.com/table/latest/docs/framework/svelte/quick-start) identifies v9 as latest, requires Svelte 5 or newer, documents opt-in features, rune-backed adapter reactivity and `createTableHook`; the npm registry reported `@tanstack/svelte-table` 9.2.4. This is an evidence note, not a dependency pin. Re-verify the documentation and registry when M5 starts and record the selected version in the implementation decision.

### Initial feature pack

- Sorting.
- Filtering.
- Pagination.
- Row selection.
- Column visibility.
- Loading, empty and error states.
- Client-controlled and server-controlled modes.

### Later feature packs

- Resizing and pinning.
- Grouping and aggregation.
- Expansion and tree rows.
- Virtualization.
- Column settings.
- Bulk actions.
- Editable cells.

### Exit gate

The initial pack passes keyboard, screen-reader, responsive, loading/empty/error and controlled-state scenarios. The preset remains optional, and consumers can compose raw table parts without forking Bedrock markup.

## Internationalization decision

English is the complete canonical source catalogue. Components never hardcode internal, accessible or live-region strings; they resolve them from that catalogue. Additional locale packs, including `de-AT`, are deferred and must not require component API changes.

## Decision log

| Date       | Decision                                                         | Consequence                                                                                                            |
| ---------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| 2026-08-30 | Preserve the custom FLIP engine as the Bedrock motion primitive. | M1 hardens its contract and coverage before components depend on it.                                                   |
| 2026-08-30 | Start with a documentation and green-baseline milestone.         | No large component implementation begins during M0.                                                                    |
| 2026-08-30 | Use the four-level maturity ladder and graduate on demand.       | The existing catalogue is not rewritten wholesale.                                                                     |
| 2026-08-30 | Require one structured contract before component implementation. | Documentation drives API, semantics, testing and maturity.                                                             |
| 2026-08-30 | Use English as the canonical string catalogue.                   | Locale breadth can arrive later without hardcoded component strings.                                                   |
| 2026-08-30 | Use TanStack's Svelte adapter for the v9 table architecture.     | TanStack owns headless table behavior; Bedrock owns rendered experience. Version selection is re-verified at M5 start. |
| 2026-08-30 | Defer templates, blocks and machine discovery.                   | Early milestones remain focused on foundations and proven patterns.                                                    |
| 2026-08-30 | Make AI/chat conditional on a real consumer.                     | No speculative chat family is built.                                                                                   |

## Explicit deferrals

- Templates and page templates.
- Copy-paste blocks.
- Machine-readable component discovery.
- Broad graduation of all generated component families.
- Later data-table feature packs listed above.
- Additional locale packs, including `de-AT`.
- AI/chat components without a real consumer.

Deferred work belongs in the [backlog](./backlog.md) with a trigger and acceptance boundary; deferral is not silent scope loss.
