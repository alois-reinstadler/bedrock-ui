# ERP interaction standards

Date: 2026-08-31 · Status: binding for the Bedrock layer

Consistency rules for building business applications with Bedrock. These are
about the _feel_ of the system under heavy daily use — a thousand clicks a
day, keyboard-first operators, dense data.

## Click targets

- **Every interactive control has a hit area of at least 44×44px** (WCAG
  2.5.5 AAA), regardless of its visual size. The visual element may be
  smaller — a 16px icon, a 24px close button — but the target may not.
- The `tap-target` utility (in `src/routes/layout.css`) expands a control's
  hit area via a pseudo-element without changing layout. Use it on every
  icon-only button below 44px visual size. The shadcn `Checkbox` already
  ships an equivalent (`after:-inset-x-3 after:-inset-y-2`).
- Adjacent expanded targets may not overlap in a way that makes the wrong
  control the closest hit — keep at least 8px between the _visual_ bounds of
  two sub-44px controls.

## Density

- Default control height is 32px (`h-8`), the shadcn baseline. Dense grids
  may go to 28px rows; never below.
- Data cells use `tabular-nums` for any number, amount, count, or date so
  columns scan vertically.
- Numeric and currency columns are right-aligned; text columns left-aligned
  (`DataTable` does this by type automatically).

## Locale

- All user-facing formatting is `de-AT` via `Intl` — never hand-rolled:
  `Intl.NumberFormat` (numbers, currency), `Intl.DateTimeFormat` (dates),
  `Intl.RelativeTimeFormat` (Timestamp). UI strings German, identifiers
  English.
- Currency defaults to EUR; per-column override via ISO 4217 code.
- Empty values render as `–` (en dash), never as empty cells or `null`.

## Keyboard

- Everything reachable by mouse is reachable by keyboard; visible focus ring
  (`focus-visible:ring-*`) on every interactive element, no `outline: none`
  without replacement.
- Enter submits single-line intents; in multi-line inputs (chat composer,
  textarea forms) Enter submits and Shift+Enter inserts a newline.
- Escape closes the innermost overlay only.

## Feedback and safety

- Destructive actions (delete, cancel document, void posting) always go
  through `AlertDialog` — never a plain click, never only Undo.
- Bulk actions state their scope in the control ("3 ausgewählt" next to the
  actions), not only in the result.
- Immediate-by-default motion policy applies (see motion system plan): grids,
  keyboard traversal, and live data never animate.

## Tables

- Row identity comes from stable business ids (`getRowId`), never array
  indexes, so selection survives sorting and filtering.
- Sortable headers expose `aria-sort`; the sort control is the header label
  itself, one click cycles asc → desc.
- An empty result set always says so ("Keine Ergebnisse."), with an action
  when there is an obvious next step.
