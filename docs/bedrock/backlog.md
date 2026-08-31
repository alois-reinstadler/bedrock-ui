# Bedrock Backlog

**Status:** Prioritized companion to the [Bedrock roadmap](./roadmap.md)

**Last updated:** 2026-08-30

## How to use this backlog

The roadmap defines sequencing and milestone gates. This backlog records actionable work, explicit deferrals and the trigger that permits deferred work to start. Items should link to a written decision or component contract before implementation begins.

Checkboxes indicate repository state, not intent:

- `[ ]` not started
- `[x]` completed and verified

Do not mark an item complete without recording the relevant check, test, browser or accessibility evidence.

## M0 — Documentation and stabilization

### Architecture records

- [x] Reconcile the [layout animations plan](../superpowers/plans/2026-08-29-layout-animations.md) with the current engine and 14-scene `/demo/ui` lab.
  - Presence is public through `reveal`, `appear` and `vanish`.
  - `Swap` is the content-replacement primitive.
  - Counter-scaling is implemented.
  - The shared-snapshot window is 480 ms.
  - Scheduling uses microtasks and grouping uses DOM-ancestor lookup.
  - Continuous-layout detection and the flush-rate guard are implemented behavior.
- [x] Create [foundations.md](./foundations.md) with the approved token taxonomy and semantic API rules.
- [x] Create [component-contract.md](./component-contract.md) with the single structured contract required for every maturity level 3 or 4 component.
- [x] Create [motion-contract.md](./motion-contract.md) with public behavior, limitations, tokens and verification requirements.
- [x] Establish decision records, dependencies, acceptance criteria and checklists; keep them current as work lands.

### Green baseline

- [x] Capture the current modified and untracked motion files as a deliberate checkpoint; do not commit without explicit approval.
- [x] Run `pnpm check` and inventory failures by root cause and owning area in the [verification baseline](./verification-baseline.md).
- [x] Separate project-wide import-resolution and documentation-site failures from motion and `/demo/ui` failures.
- [x] Re-run the cached shared-attachment diagnostic: it is not present in the current checkpoint; reopen only with a reproducible diagnostic.
- [x] Resolve the remaining type-check baseline.
- [x] Run the current unit and browser test suites.
- [x] Record commands, exit codes and any intentionally excluded suite.

### M0 completion gate

- [x] Planning documents match the implementation.
- [x] `pnpm check` passes.
- [x] Current tests pass.
- [x] No stabilization failure is waived without a dated decision and owner.

## M1 — Motion foundation

### Contract

- [ ] Define supported discrete-layout, packing, shared-element and size scenarios.
- [ ] Document and enforce the no-nested-projection rule.
- [ ] Decide behavior for `layout()` outside `LayoutGroup`.
- [ ] Define shared-ID lifetime and behavior within and across groups.
- [ ] Define interruption and retargeting guarantees.
- [ ] Define window-scroll and nested-scroll-container behavior.
- [ ] Define reduced-motion behavior for every public primitive.
- [ ] Define SSR and hydration behavior.
- [ ] Document observer/measurement cost and recommend a group-size ceiling.
- [ ] Distinguish continuous CSS transitions from discrete layout changes.
- [ ] Explain the transform-only FLIP boundary and the permitted height animation in `reveal`.
- [ ] Resolve logical positioning and RTL behavior for `vanish`.
- [ ] Freeze the public export surface.
- [ ] Harden the existing Astryx-aligned duration, easing and spring presets; define the remaining semantic distance roles without silently replacing the seed values.

### Verification and diagnostics

- [ ] Add a browser component test for layout flush.
- [ ] Add an interruption/retargeting test.
- [ ] Add a shared-ID transfer test.
- [ ] Add a reduced-motion test.
- [ ] Add window and nested-scroll tests.
- [ ] Add removal/insertion coverage for `appear` and `vanish`.
- [ ] Add replacement coverage for `Swap` without a double-sized intermediate shell.
- [ ] Add a 50–100-node performance fixture and record its environment and limits.
- [ ] Warn in development when the flush-rate guard drops an update.
- [ ] Add an SSR/hydration fixture.
- [x] Exercise the complete motion lab in the shared browser; record console and network results.

### Integration follow-up

- [ ] After M2 primitives harden, replace raw headings, stacks, buttons and inputs in `/demo/ui` with Bedrock primitives.
- [ ] Retain the motion lab as both an exploratory surface and a design-system integration fixture.

## M2 — Semantic foundations

### Tokens

- [ ] Semantic surface, text, border, accent and status colors.
- [ ] Hover, pressed, selected and disabled overlays.
- [ ] Spacing and density.
- [ ] Control sizes and tap targets.
- [ ] Typography roles.
- [ ] Role-based radii.
- [ ] Borders and elevation.
- [ ] Focus treatment.
- [ ] Layer and z-index levels.
- [ ] Motion tokens aligned with M1.
- [ ] Responsive and container behavior.
- [ ] Data-visualization colors.

### Semantic primitives

- [ ] Contract and harden `Text`.
- [ ] Contract and harden `Heading`.
- [ ] Contract and harden `Link`.
- [ ] Contract and harden `Icon`.
- [ ] Contract and harden `VisuallyHidden`.

### Layout primitives

- [ ] Contract and harden `Stack`.
- [ ] Contract and harden `HStack`.
- [ ] Contract and harden `VStack`.
- [ ] Contract and harden `Grid`.
- [ ] Contract and harden `Center`.
- [ ] Contract and harden `Section`.
- [ ] Define the boundary between `Layout` and `PageLayout` before implementing either.

APIs remain semantic: text roles and elements instead of arbitrary utility classes; direction, gap, alignment and wrapping instead of an unrestricted CSS-prop system.

## M3 — `PageLayout` and `AppShell`

### Scope

- [ ] Contract `PageLayout` header, content, panel and footer slots.
- [ ] Contract and harden `TopNav`.
- [ ] Contract and harden `SideNav`.
- [ ] Contract and harden `MobileNav`.
- [ ] Add the skip link and main-content landmark.
- [ ] Add an optional utility or secondary panel.
- [ ] Compose `AppShell` from these APIs without duplicating them.
- [ ] Verify navigation collapse and panel resizing with and without motion.

### Acceptance

- [ ] Landmark and heading structure is valid.
- [ ] Skip navigation, focus order and keyboard navigation work.
- [ ] Responsive navigation preserves names, state and reachability.
- [ ] Dark mode and reduced motion follow component contracts.
- [ ] Shell semantics remain complete when JavaScript motion is unavailable.

## M4 — `FormLayout`

### Initial scope

- [ ] Vertical field arrangement.
- [ ] Horizontal field arrangement.
- [ ] Field groups and semantic fieldsets.
- [ ] Required and optional indicators.
- [ ] Description, warning, error and success messages.
- [ ] Form-level validation summary with focus navigation.
- [ ] Pending and submitting states.
- [ ] Primary and secondary actions.
- [ ] Responsive label placement.
- [ ] Async validation and server-error presentation.

### Integration boundary

- [ ] Provide a native Svelte form example.
- [ ] Provide an existing Superforms integration example.
- [ ] Keep field and layout contracts independent of both integrations.
- [ ] Resolve internal, accessible and live-region strings through the canonical catalogue.

## M5 — Data table system

### Architecture decisions

- [ ] Re-verify the current Table v9 Svelte adapter and supported API against the [official Svelte quick start](https://tanstack.com/table/latest/docs/framework/svelte/quick-start); record the date and selected dependency version.
- [ ] Adopt the Svelte adapter rather than integrating only the table core.
- [ ] Assign headless state and row processing to TanStack.
- [ ] Assign markup, accessibility, density, visuals and interaction contracts to Bedrock.
- [ ] Specify an optional Bedrock `createTableHook` preset for shared features and conventions.
- [ ] Keep raw table parts independently composable.

Evidence captured on 2026-08-30: the official documentation identifies Svelte Table v9 as latest and the npm registry reports `@tanstack/svelte-table` 9.2.4. This does not pin the future dependency; re-verify and select it when M5 begins.

### Initial feature pack

- [ ] Sorting.
- [ ] Filtering.
- [ ] Pagination.
- [ ] Row selection.
- [ ] Column visibility.
- [ ] Loading state.
- [ ] Empty state.
- [ ] Error state.
- [ ] Client-controlled mode.
- [ ] Server-controlled mode.

### Later feature packs

- [ ] Resizing and pinning.
- [ ] Grouping and aggregation.
- [ ] Expansion and tree rows.
- [ ] Virtualization.
- [ ] Column settings.
- [ ] Bulk actions.
- [ ] Editable cells.

Later packs remain deferred until the initial pack is stable and a consumer supplies a concrete scenario.

## Cross-cutting component contract

Before implementation, every hardened foundation or complex pattern must specify:

- [ ] Purpose, appropriate use and inappropriate use.
- [ ] Anatomy.
- [ ] Props, defaults and controlled/uncontrolled state.
- [ ] Composition and slot behavior.
- [ ] Semantic HTML.
- [ ] Accessible-name requirements.
- [ ] Keyboard and focus behavior.
- [ ] Default, hover, focus, active, disabled, selected, loading and error states.
- [ ] Dark mode, reduced motion and responsive behavior.
- [ ] Theme tokens and customizable parts.
- [ ] Internal strings and live-region messages.
- [ ] Performance expectations.
- [ ] Examples and composition stories.
- [ ] Unit, browser, accessibility and visual-test requirements.
- [ ] Maturity status.

## Component-family graduation queue

There is no standing task to rewrite all existing component families. Add a family to this queue only when a named milestone or real product pattern needs it.

For each candidate:

- [ ] Name the requiring milestone or consumer.
- [ ] Record its current maturity level.
- [ ] Choose the target level from the [maturity ladder](./roadmap.md#maturity-ladder).
- [ ] Write the component contract.
- [ ] Identify compatibility and migration risks.
- [ ] Implement only the required surface.
- [ ] Attach verification evidence before changing maturity status.

## Internationalization

- [ ] Define the complete English canonical source catalogue.
- [ ] Prohibit hardcoded internal, accessible and live-region component strings.
- [ ] Define catalogue lookup and fallback behavior without coupling component APIs to a translation library.
- [ ] Add a `de-AT` locale pack when a milestone or consumer requires translation coverage.
- [ ] Verify that adding locale packs requires no component API changes.

## Explicitly deferred

### Templates, blocks and discovery

**Trigger:** At least one product-level pattern is stable and repeated enough to package or expose.

- [ ] Page templates.
- [ ] Copy-paste blocks.
- [ ] Machine-readable component discovery.

### AI/chat family

**Trigger:** A real Bedrock consumer requires streaming chat, citations or tool-call rendering.

- [ ] `ChatLayout`.
- [ ] `MessageList`.
- [ ] `Message`.
- [ ] `Composer`.
- [ ] Send and stop controls.
- [ ] `ToolCall`.
- [ ] `Citation`.
- [ ] Markdown rendering contract.
- [ ] Streaming-scroll behavior.

Do not build this family speculatively. When triggered, begin with the consumer's interaction, accessibility, streaming and failure requirements, then write contracts before components.

## Backlog decision log

Use this table for backlog changes that alter scope or ordering.

| Date       | Change                                                     | Reason                                                                | Effect on milestones                                                   |
| ---------- | ---------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 2026-08-30 | Created the layered backlog.                               | Preserve and harden motion before expanding Bedrock.                  | Establishes M0–M5 order and explicit later/conditional work.           |
| 2026-08-30 | Added on-demand component graduation.                      | Catalogue size is not a reason to rewrite unused families.            | Families enter milestones only through a named dependency or consumer. |
| 2026-08-30 | Deferred locale breadth but fixed the string architecture. | Avoid API churn without making translation coverage an early blocker. | English catalogue is foundational; `de-AT` is a later pack.            |
| 2026-08-30 | Deferred AI/chat until demanded.                           | No current consumer establishes the right streaming contract.         | AI/chat has no milestone allocation until its trigger is met.          |
