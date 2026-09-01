# Brief: Bedrock UI rethink — DataTable v2 shell, motion phase 1, architecture principles

You are Codex, implementing in the worktree `/workspace/wt/bedrock-erp-v2`
(branch `agent/bedrock-erp-v2`). Claude reviews your plan and your diff.

## Two-step protocol

**Step 1 (this run): plan only.** Read everything under "Context to read",
then write `docs/superpowers/plans/2026-09-01-erp-v2-implementation.md`: a
file-level implementation plan (every file you will create/edit and what
changes in it, in dependency order), open questions, and any spec conflicts
you found. Do NOT edit any other file in step 1.

**Step 2 (after Claude approves the plan): implement.**

## Context to read first

- `docs/bedrock/erp-standards.md` — binding interaction standards
- `docs/superpowers/plans/2026-08-31-motion-system.md` — motion design incl.
  the per-component mapping section
- `docs/superpowers/plans/2026-08-31-erp-primitives.md` — component roadmap
- `src/lib/bedrock/motion/tokens.ts` — semantic motion tokens (Astryx ladder)
- `src/lib/bedrock/ui/data-table/` — DataTable v1 (TanStack v9)
- `node_modules/@tanstack/table-core/skills/*/SKILL.md` — v9 API docs
  (grouping, column sizing, etc. — read the ones you need)
- `src/routes/layout.css` — theme + `tap-target` utility
- `src/lib/shadcn/ui/` — FROZEN baseline. Never edit anything under
  `src/lib/shadcn/`. Bedrock wrappers in `src/lib/bedrock/ui/` may add
  classes/behavior on top.

## Architecture principles (encode AND apply)

1. **Components over primitives.** Use existing components for everything
   they cover before reaching for raw HTML. Inside Bedrock components,
   compose shadcn/bits primitives; in demos/docs, compose Bedrock components.
2. **Dense data renders as rows** (Table, List/Item), edge-to-edge with
   dividers. `Card` is for widgets, galleries, and settings groups — never
   for record lists.
3. **Form inputs are controlled** (value + onChange/bindable). Every new
   Bedrock input surface must expose controlled value props.

## Motion principles (from Astryx, binding)

- Fast tokens (130–230ms) for small frequent interactions; medium (310–550ms)
  for layout-rearranging transitions. Tokens come from
  `src/lib/bedrock/motion/tokens.ts` / the CSS custom properties you emit —
  never raw durations in the Bedrock layer.
- **Where motion hurts:** table row hovers, list item highlights, anything
  done dozens of times per minute — no perceptible duration, ever.
- **Exit is optional:** tooltips, hover cards, dropdown menus may disappear
  instantly. Animate exits only when they orient (panel closing, dialog
  revealing what's underneath).
- **Match entrance/exit** direction. **Direction matches the action**
  (deeper = forward, back = returning). **Contextual UI originates from its
  trigger** (transform-origin from the bits-ui content origin variables);
  global UI (command palette, toasts) has fixed positions.
- Never block the next interaction on an animation. Honor
  `prefers-reduced-motion` (instant state commit).

## Scope A — Motion phase 1 (CSS + Swap, no FLIP)

1. Extend `tokens.ts`: split overlay weights — add `popover`
   (enter 200 / exit 150) and `hint` (enter 140 / exit 100) presets.
2. New file `src/lib/bedrock/motion/tokens.css`: CSS custom properties for
   every duration/easing (e.g. `--motion-press`, `--motion-ease-enter`) plus
   an `@media (prefers-reduced-motion: reduce)` block setting all durations
   to `0.01ms`. Import it from `src/routes/layout.css`. Add a small unit
   test asserting tokens.css values match tokens.ts (parse the css string).
3. Utility classes (in `layout.css` as `@utility`, or a dedicated css file):
   `motion-press`, `motion-state`, `motion-overlay`, `motion-popover`,
   `motion-hint`, `motion-reveal` — driven by the custom properties and
   bits-ui `data-state`/`data-side` attributes, using `@starting-style` +
   `transition-behavior: allow-discrete` where relevant.
4. Apply per the component mapping in the motion plan doc, via Bedrock
   wrapper `class` additions (NOT shadcn edits):
   - Tooltip: fast enter, instant exit
   - DropdownMenu/ContextMenu/Select/Popover/HoverCard/Combobox content:
     popover preset, origin from trigger, near-instant exit
   - Dialog/AlertDialog: overlay preset in, exit 175 out
   - Sheet/Drawer: drawer easing, matched exit direction
   - Banner: enter 230 from top (already partially built — polish)
   - Chat message entrance: enter 230 slide-up (new messages only)
   - Async-swap: use the existing `Swap` component for the DataTable
     selected-count numeral
   - Remove every `transition-all` and raw `duration-*` under
     `src/lib/bedrock/` (shadcn layer stays as is)
5. If a wrapper today is a bare pass-through and needs a class merge, convert
   it to merge `cn(<motion classes>, className)` while keeping its public
   API identical.

## Scope B — DataTable v2 shell

Extend `src/lib/bedrock/ui/data-table/` (keep v1 public props working):

1. **View tabs**: new prop `views?: { key; label; filter: (row) => boolean; }[]`
   rendered as a tab strip above the toolbar with live counts per view
   (count = rows matching filter, before pagination), zero-count tabs dimmed
   but clickable, active view drives a table-level filter. "Alle" view
   automatic. Selection indicator styled like the demo scene 01 pill
   (CSS-only for now; FLIP later).
2. **Toolbar**: left cluster search + `Group` select (grouping column picker,
   from new prop `groupable?: string[]` using `rowGroupingFeature` +
   `createGroupedRowModel` + expanded rows); right cluster: density toggle
   (32px default / 40px comfortable — persists in component state), column
   settings (existing), export slot (existing `actions` stays for bulk).
3. **Column types**: add `'id'` (renders `font-mono text-xs`), `'badge'`
   (value → Badge with a `badgeVariant` mapper prop on the column), and
   currency rendering split: amount right-aligned + muted currency code
   (per screenshot reference). Keep existing types working.
4. **Counts + footer**: "x von y Einträgen" line (German), footer keeps
   selection count + pagination.
5. **Grouped rows**: group header row shows group value + count, expandable
   (chevron), rows indent under it. Grouping and view/tab switching stay
   instant (no motion).
6. Update `/demo/erp` to showcase: views (by status, with counts), grouping
   by customer, density toggle, id + badge column types.

## Scope C — encode principles

Add the three architecture principles and the "where motion hurts" list to
`docs/bedrock/component-contract.md` (extend, don't rewrite). Audit the ten
new Bedrock families for violations (uncontrolled inputs, card-wrapped
lists) and fix any found.

## Constraints

- pnpm only. No new dependencies without listing them in the plan first.
- Never edit `src/lib/shadcn/**`, `pnpm-lock.yaml` conflicts, or unrelated
  files. No commits, no pushes.
- German UI strings, English identifiers, `de-AT` Intl.
- Existing exports/props must remain source-compatible (demo pages are the
  reference consumers).

## Acceptance criteria (run these, report actual output)

1. `pnpm check` → 0 errors, 0 warnings.
2. `npx eslint src/lib/bedrock src/routes/demo` → clean.
3. `pnpm build` → succeeds.
4. `grep -rn "transition-all" src/lib/bedrock/` → no matches;
   `grep -rnE "duration-[0-9]" src/lib/bedrock/` → no matches.
5. `git diff --stat src/lib/shadcn/` → empty.
6. Unit test for tokens.css ↔ tokens.ts parity passes via
   `pnpm test:unit -- --run src/lib/bedrock/motion`.
7. Demo `/demo/erp` renders the v2 table (build output is enough; Claude
   does the browser pass).

## Progress reporting

In every progress update / log section, include an ASCII progress bar:
`[####------] 40% <phase>` — 10 chars wide, `#` done `-` remaining, percent
by completed phases, `[##########] 100% Complete` only after all acceptance
criteria have been run and pass. If blocked, keep the honest percentage and
label it `Blocked`.
