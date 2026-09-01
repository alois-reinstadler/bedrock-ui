# Bedrock ERP v2 implementation plan

Date: 2026-09-01  
Status: proposed — Step 1 only; implementation starts after approval  
Source: `specs/erp-v2-brief.md`

## Scope and guardrails

- Ship motion phase 1 (CSS utilities and the existing `Swap`, no FLIP rollout), the source-compatible DataTable v2 shell, and the architecture-contract update/audit.
- Preserve every existing Bedrock public prop and export. Add only optional DataTable props and column metadata. Keep all UI strings German and all `Intl` formatting `de-AT`.
- Compose Bedrock components in the ERP demo and Bedrock/shadcn or bits-ui primitives inside Bedrock implementations. Dense record data remains an edge-to-edge table/list, never a set of cards.
- Do not edit `src/lib/shadcn/**`, add dependencies, edit `pnpm-lock.yaml`, or introduce raw motion durations/classes in `src/lib/bedrock/**`.
- DataTable sorting, filtering, view switching, grouping toggles, pagination, density changes, and row hover remain immediate. The only DataTable motion in this phase is the selected-count numeral through the existing `Swap`; the view indicator stays CSS-only until the FLIP gate is complete.

## Implementation plan (dependency order)

### 1. Establish the semantic motion source and CSS parity

1. **Edit `src/lib/bedrock/motion/tokens.ts`.** Add `popover` with enter/exit durations of 200/150 ms and `hint` with enter/exit durations of 140/100 ms while preserving all existing preset keys and motion easing exports. Keep the TypeScript object authoritative and expose enough structured values for CSS parity assertions without changing existing consumers.
2. **Create `src/lib/bedrock/motion/tokens.css`.** Declare custom properties for every semantic duration and cubic-bezier easing in `tokens.ts`, including press, state, enter, exit, reveal, overlay, popover enter/exit, hint enter/exit, layout, swap, and the enter/exit/move/drawer curves. Add a `prefers-reduced-motion: reduce` override that sets every duration property to `0.01ms`; easing properties remain intact because state commits become effectively immediate.
3. **Create `src/lib/bedrock/motion/tokens-css.test.ts`.** Read and parse `tokens.css`, compare every normal duration/easing declaration against `motionPresets`, and assert that the reduced-motion block overrides the complete duration-property set with `0.01ms`. This is a drift test for the checked-in CSS rather than a second token generator.
4. **Edit `src/lib/bedrock/motion/tokens.test.ts`.** Extend the semantic preset assertions for `popover` and `hint` so the public TypeScript token contract is pinned independently of the CSS parser test.
5. **Edit `src/routes/layout.css`.** Import `tokens.css` after the framework/theme imports, then add semantic `@utility` definitions for `motion-press`, `motion-state`, `motion-overlay`, `motion-popover`, `motion-hint`, and `motion-reveal`. Utilities will use only token custom properties; overlay utilities will respond to bits-ui open/closed state and side attributes, take transform origin from the relevant bits-ui origin variable with a safe fallback, use matching side-aware entry/exit transforms, and use `@starting-style` plus `transition-behavior: allow-discrete` where presence permits. Row hover and other high-frequency highlight styles receive no duration.

### 2. Apply phase-1 motion through Bedrock wrappers

Each pass-through wrapper below will keep its existing component type/export and forwarded props, destructure `class`, and merge `cn(<semantic utility>, className)` so consumer classes remain supported. No shadcn source will change.

6. **Edit `src/lib/bedrock/ui/tooltip/tooltip-content.svelte`.** Add `motion-hint`, preserving trigger-origin/side behavior and making close effectively instant.
7. **Edit `src/lib/bedrock/ui/dropdown-menu/dropdown-menu-content.svelte` and `src/lib/bedrock/ui/dropdown-menu/dropdown-menu-sub-content.svelte`.** Add `motion-popover` to root and submenu content with trigger-origin and side-aware entry; close is near-instant.
8. **Edit `src/lib/bedrock/ui/context-menu/context-menu-content.svelte` and `src/lib/bedrock/ui/context-menu/context-menu-sub-content.svelte`.** Apply the same popover policy to root and nested contextual menus.
9. **Edit `src/lib/bedrock/ui/select/select-content.svelte`, `src/lib/bedrock/ui/popover/popover-content.svelte`, `src/lib/bedrock/ui/hover-card/hover-card-content.svelte`, and `src/lib/bedrock/ui/combobox/combobox-content.svelte`.** Add `motion-popover`, retain each primitive's public props and transform-origin variable, and remove the Combobox's raw `duration-100` in favor of the semantic utility.
10. **Edit `src/lib/bedrock/ui/dialog/dialog-overlay.svelte`, `src/lib/bedrock/ui/dialog/dialog-content.svelte`, `src/lib/bedrock/ui/alert-dialog/alert-dialog-overlay.svelte`, and `src/lib/bedrock/ui/alert-dialog/alert-dialog-content.svelte`.** Add `motion-overlay` so modal overlay/content enter with the overlay preset and exit with the existing 175 ms semantic exit token.
11. **Edit `src/lib/bedrock/ui/sheet/sheet-overlay.svelte` and `src/lib/bedrock/ui/sheet/sheet-content.svelte`.** Add overlay/drawer semantic motion; content uses its declared side to enter and leave in matched directions with drawer easing, while the backdrop follows overlay timing.
12. **Edit `src/lib/bedrock/ui/drawer/drawer-overlay.svelte` and `src/lib/bedrock/ui/drawer/drawer-content.svelte`.** Add semantic overlay/drawer classes keyed to Vaul's direction and state attributes so all four directions have matched, interruptible entry/exit behavior.
13. **Edit `src/lib/bedrock/ui/banner/banner.svelte`.** Polish the existing component with the semantic 230 ms top-entry treatment and 175 ms matched close/reveal collapse behavior, while reduced motion commits immediately and the public API stays unchanged.
14. **Edit `src/lib/bedrock/ui/chat/chat-message.svelte`.** Add the semantic 230 ms slide-up entrance to newly mounted messages only; do not animate message updates/streaming or existing scroll behavior.
15. **Edit `src/lib/bedrock/ui/lightbox/lightbox.svelte`.** Replace both raw `duration-*` classes with semantic overlay motion and use the existing `Swap` for keyed previous/next image replacement where compatible with the current Lightbox markup. Preserve controlled `open`/`index`, keyboard navigation, and German labels.
16. **Edit `src/lib/bedrock/ui/chat/chat-composer.svelte` and `src/lib/bedrock/ui/combobox/combobox-input.svelte`.** Replace generic transition classes on frequently used controls with the appropriate semantic state/press utilities, retain the controlled/bindable value surfaces, and keep keyboard behavior unchanged.
17. **Audit all files under `src/lib/bedrock/` and edit only additional matching files found by `rg 'transition-all|duration-[0-9]+' src/lib/bedrock`.** Replace prohibited raw classes with the closest semantic utility. The current baseline has raw duration matches only in Lightbox and Combobox content; this final sweep protects against overlooked or newly exposed matches without authorizing unrelated cleanup.

### 3. Extend the DataTable types and formatting contract

18. **Edit `src/lib/bedrock/ui/data-table/types.ts`.** Add exported `DataTableView<TData>` (`key`, `label`, row predicate) and density types; extend `DataTableColumnType` use with `id` and `badge`; add an optional typed `badgeVariant(value, row)` mapper on columns. Keep all existing column fields source-compatible and type `groupable` against column keys at the component boundary as far as the current string-key API permits.
19. **Edit `src/lib/bedrock/ui/data-table/formatters.ts`.** Extend the formatter type with `id` and `badge` while retaining existing text/number/date/datetime behavior and the empty-value en dash. Split currency into reusable `de-AT` amount and ISO-code parts so the renderer can right-align the amount and render the currency code muted, rather than returning one opaque currency string.
20. **Edit `src/lib/bedrock/ui/data-table/index.ts`.** Re-export the new view/density types and any new currency-format helper required by consumers/tests without removing current exports.
21. **Create `src/lib/bedrock/ui/data-table/formatters.test.ts`.** Cover existing type compatibility, `id`, empty values, `de-AT` number/date output, and split currency amount/code output.

### 4. Build the source-compatible DataTable v2 shell

22. **Edit `src/lib/bedrock/ui/data-table/data-table.svelte`.** Keep the current required and optional props working, and add optional `views`, `groupable`, and `export` snippet props. Implement the shell as follows:

- Register TanStack v9 `columnGroupingFeature` + `createGroupedRowModel()` and `rowExpandingFeature` + `createExpandedRowModel()` in prerequisite order alongside the existing explicit features. Limit grouping eligibility to configured column keys.
- Add an automatic “Alle” view, compute each supplied view's count from original input rows before pagination, keep zero-count tabs enabled but visually muted, reset the page as needed, and apply the active predicate through a client-side table filter before pagination. View/filter/group state changes stay immediate.
- Render view tabs above a two-cluster toolbar. The left cluster contains controlled Bedrock search plus a “Gruppieren” select derived from `groupable`; the right cluster contains a local 32/40 px density toggle, existing column visibility settings, and the new export snippet. Existing `actions` remains selection-only bulk UI.
- Render group header rows as disclosure rows with group value, descendant leaf count, and a 44 px-safe chevron control. Render expanded leaf rows indented; do not treat generated group rows as business records for row click/selection. Preserve stable business row ids.
- Render `id` cells in `font-mono text-xs`, `badge` cells through the Bedrock `Badge` and per-column variant mapper, and currencies as right-aligned amount plus muted ISO code. Existing custom cell snippets continue to win over built-in formatting.
- Apply density to row/header height without motion, add the German pre-pagination count line “x von y Einträgen”, and retain selection count and pagination controls in the footer. Wrap only the selected-count numeral in `Swap`; selection actions must remain immediately interactive.
- Preserve semantic table markup, `aria-sort`, accessible selection/disclosure labels, the current custom empty snippet, and “Keine Ergebnisse.” behavior.

23. **Create `src/lib/bedrock/ui/data-table/data-table.test.svelte`.** Provide a small typed fixture exposing views, grouping, selection, density, pagination, `id`, `badge`, and currency behavior for component tests without coupling tests to the full demo route.
24. **Create `src/lib/bedrock/ui/data-table/data-table.svelte.test.ts`.** Verify old minimal props still render, automatic/all and custom view counts are pre-pagination, zero-count tabs remain clickable, view switching filters immediately, grouping expands/collapses with correct leaf counts/indentation, density toggles 32/40 px state, column types render correctly, German counts are correct, and selection numeral changes through `Swap` without delaying actions.

### 5. Encode and apply architecture principles

25. **Edit `docs/bedrock/component-contract.md`.** Extend (do not rewrite) the contract with binding Bedrock architecture guidance: prefer existing components over raw elements, compose shadcn/bits primitives inside Bedrock and Bedrock components in demos/docs; render dense records as edge-to-edge Table/List/Item rather than Card; require every new input surface to expose controlled value/change or bindable semantics; and explicitly list motion-harm zones (table row hover, list highlights, keyboard traversal, sort/filter/page/group/view updates, dragging/scrolling, streaming/live data, and other high-frequency interactions) as immediate.
26. **Audit the ERP families represented by the current `/demo/erp` surface:** `data-table`, `combobox`, `overflow-list`, `avatar` (`AvatarStack`), `banner`, `status-dot`, `timestamp`, `thumbnail`, `lightbox`, `visually-hidden`, and `chat`. Record/fix actual violations only in their existing implementation files. Expected findings from the Step 1 inspection are: no card-wrapped record list; Combobox, Lightbox, and Chat Composer already expose bindable controlled state; DataTable's newly introduced interactive surface is local preference/filter UI rather than a reusable form value. Any fix discovered during the deeper Step 2 audit will be limited to those family directories and added to the implementation report before verification.

### 6. Update the ERP demonstration

27. **Edit `src/routes/demo/erp/+page.svelte`.** Keep the existing primitive showcase but update the order table to use automatic “Alle” plus status views with live counts, grouping by customer, the density toggle, `id` for the order number, `badge` for status with a Bedrock Badge variant mapper, split currency output, and the dedicated export slot. Continue using Bedrock components rather than raw substitutes and retain German copy/de-AT data.

### 7. Verification and scope checks

28. Run focused tests first: `pnpm test:unit -- --run src/lib/bedrock/motion` and the new DataTable/formatter tests. Then run the required full gates in this order:
1. `pnpm check` — require 0 errors and 0 warnings.
1. `pnpm exec eslint src/lib/bedrock src/routes/demo` — equivalent to the brief's `npx eslint ...` while honoring the repository's pnpm-only rule; require clean output.
1. `pnpm build` — require a successful production build, including `/demo/erp`.
1. `grep -rn "transition-all" src/lib/bedrock/` and `grep -rnE "duration-[0-9]" src/lib/bedrock/` — require no matches.
1. `git diff --stat -- src/lib/shadcn/` — require empty output.
1. `git diff --name-only` — require only the files approved by this plan and no lockfile/shadcn changes.
1. Report literal command outcomes. Do not mark implementation complete if any gate fails; keep the progress bar below 100% and identify the failing gate.

## Open questions for approval

1. **Which “ten new Bedrock families” are authoritative?** The primitives roadmap names eleven demo additions if `AvatarStack` is counted separately: DataTable, Combobox, OverflowList, AvatarStack, Banner, StatusDot, Timestamp, Thumbnail, Lightbox, VisuallyHidden, and Chat. This plan audits all eleven so none is silently omitted; approval should confirm that interpretation.
2. **Should the DataTable export surface be named `export` or `exportActions`?** The brief describes an “export slot” but gives no prop name. This plan uses the concise optional `export` snippet and keeps `actions` exclusively for bulk selection. If `export` is considered awkward as a prop identifier, use `exportActions` before implementation begins.
3. **Should density persist only for the mounted component or across remounts?** “Persists in component state” is interpreted as local component state for the current mount, with no `localStorage` and no new controlled prop. Confirm if cross-session persistence is expected.
4. **Should group rows start expanded or collapsed?** The brief requires expandable groups but does not define initial expansion. This plan defaults groups to expanded so choosing “Gruppieren” retains immediate access to records; users can collapse individual groups.

## Spec conflicts and resolutions

1. **TanStack feature name:** the brief requests `rowGroupingFeature`, but installed `@tanstack/table-core@9.2.4` exports `columnGroupingFeature`; there is no `rowGroupingFeature`. The package's grouping skill and declarations require `columnGroupingFeature` with `createGroupedRowModel()`, plus `rowExpandingFeature`/`createExpandedRowModel()` for disclosure. Implementation will use the installed v9 API.
2. **TanStack skill path:** the literal `node_modules/@tanstack/table-core/skills/*/SKILL.md` path is absent because pnpm did not create that top-level package symlink. The same package-owned skills exist under `node_modules/.pnpm/@tanstack+table-core@9.2.4/node_modules/@tanstack/table-core/skills/`; the core, table-features, client-vs-server, column-filtering, global-filtering, grouping, expanding, and pagination skills were read from there.
3. **Package-manager command:** acceptance criterion 2 uses `npx`, while repository policy forbids npm tooling. Verification will use `pnpm exec eslint src/lib/bedrock src/routes/demo`, which invokes the same local ESLint binary without npm.
4. **Token generation:** the motion design document proposes a future `pnpm motion:tokens` generation script, while this Step 1 brief explicitly asks for a new checked-in CSS file and a unit test that parses it against `tokens.ts`; it does not request a script. This plan follows the narrower phase-1 brief and enforces parity with the test, adding no package script.
5. **Popover timing:** the component mapping in the older motion plan says popover-class content enters at 230 ms and exits instant/100 ms, while the newer brief explicitly adds a `popover` preset at 200/150 ms and asks those components to use it. The newer explicit preset wins: 200 ms entry and a 150 ms upper bound for close, with tooltip close instant and other contextual exits allowed to be shortened where the utility/state model supports it.
6. **Banner exit API:** the brief asks to polish Banner entry/exit, but `Banner.Root` does not own visibility or a close lifecycle; the demo conditionally mounts it. The implementation can guarantee semantic mount animation and reduced-motion behavior in the component, but an animated height-collapse exit requires presence ownership at the conditional call site or a new controlled visibility API. To preserve the current public API in phase 1, the demo will keep synchronous removal unless approval explicitly expands Banner into a controlled presence component.

## Dependency changes

None. The existing Svelte 5, bits-ui, Bedrock wrappers, `@tanstack/svelte-table@9.2.4`, Vitest, and Testing Library stack cover the work.
