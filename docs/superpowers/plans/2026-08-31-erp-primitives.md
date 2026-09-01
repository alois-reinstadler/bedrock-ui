# ERP primitives roadmap

Date: 2026-08-31 · Status: in progress · Depends on: frozen shadcn baseline, Bedrock wrapper layer

**Implemented 2026-08-31** (see `/demo/erp` and `docs/bedrock/erp-standards.md`):
`DataTable` (TanStack Table v9, sorting/multi-selection with bulk actions/
pagination/global search/column visibility, de-AT formatters), `Combobox`
(bits-ui), `OverflowList`, `AvatarStack`, `Banner`, `StatusDot`, `Timestamp`,
`Thumbnail`, `Lightbox`, `VisuallyHidden`, `Chat` suite (Root, MessageList
with stick-to-bottom, Message, MessageBubble, MessageMetadata, SystemMessage,
Composer), plus the `tap-target` hit-area utility. Still open from the gap
list: NumberField, TagsInput, Tree, Stepper, PowerSearch, date-field
wrappers, Toolbar wrapper, MetadataList, FileUpload, DataTable
virtualization/inline editing.

What Bedrock needs beyond the 55 shadcn families to build business applications
(ERPs, back-office tools, admin surfaces). Sourced from Meta's Astryx design
system (150+ components, explicitly agent-ready, themes declare motion as a
first-class dimension) and the enterprise grid ecosystem (AG Grid, DevExtreme,
Syncfusion feature sets), mapped onto what is actually buildable in Svelte 5.

## What we already have covered

bits-ui 2.19 ships primitives the shadcn baseline never wrapped:
`date-field`, `date-picker`, `date-range-field`, `date-range-picker`,
`time-field`, `time-range-field`, `toolbar`, `meter`, `rating-group`,
`pin-input`. These need only Bedrock wrappers + styling — cheap wins, no
primitive engineering.

## Gap list (priority order)

| # | Primitive | Why an ERP needs it | Inspiration | Implementation path |
|---|---|---|---|---|
| 1 | **DataGrid** | The core surface: virtualized rows, inline editing, column resize/pin/sort/group, tree data, selection, copy/paste | Astryx Table, AG Grid | Headless: TanStack Table core (framework-agnostic, Svelte 5 works with a thin runes adapter) + row virtualization. Skin with the existing `Table` family. Native alternative: SVAR Svelte DataGrid (check license before adopting). Do NOT hand-roll virtualization. |
| 2 | **NumberField** | Quantities, prices, percentages with `de-AT` `Intl.NumberFormat`, currency mode, stepper buttons, min/max/precision | Astryx Number Input | Not in bits-ui. Build on `InputGroup`; format on blur, parse on input, `Intl`-driven. This is the highest-value *small* primitive for ERP forms. |
| 3 | **Date/Time field wrappers** | Typed segment-based date entry (not popover-only), ranges, datetime | Astryx Date/DateRange/DateTime Input | Wrap existing bits-ui `date-field` / `date-range-field` / `time-field` (`@internationalized/date`, `de-AT` locale). Low effort, high ERP value. |
| 4 | **TagsInput / MultiSelect** | Assigning categories, cost centers, labels; token-based entry | Astryx Tokenizer + Multi Selector | bits-ui `combobox` supports multiple selection; build token chips on top (`Badge` + packing motion). |
| 5 | **Tree / TreeList** | Chart of accounts, BOM explosion, org units, warehouse locations | Astryx Tree List | No bits-ui primitive. Build: ARIA `treegrid`/`tree` pattern, keyed rows, virtualize past ~500 nodes. Reuse Collapsible mechanics per node. |
| 6 | **Stepper / Wizard** | Multi-step document flows (order → delivery → invoice) | Astryx Stepper | Compose from `Tabs` semantics + validation gating; keyed-content-replacement motion between steps. |
| 7 | **PowerSearch / FilterBuilder** | Token-based query building ("status:open amount:>1000") over grids | Astryx Power Search + Typeahead | Compose `Command` + TagsInput + a typed token grammar. Ship after 1 and 4 exist. |
| 8 | **Banner / StatusDot / Timestamp** | System-level notices, record state at a glance, `Intl.RelativeTimeFormat` timestamps | Astryx Feedback set | Small components, build directly in Bedrock. Timestamp: `de-AT`, auto-updating via `SvelteDate`. |
| 9 | **DescriptionList (MetadataList)** | Record detail headers: label/value pairs with copy, truncation, empty states | Astryx Metadata List | Pure composition of `Item` + `Field`; mostly a styled pattern. |
| 10 | **FileUpload** | Attachments on documents, with progress + retry | Astryx File Input | Build on `Input type=file` + `Progress`; async-boundary motion for upload states. |
| 11 | **Toolbar wrapper** | Grid/detail-view command bars with overflow behavior | Astryx Toolbar | Wrap bits-ui `toolbar`; overflow → `DropdownMenu` ("More" pattern). |
| 12 | **App-shell patterns** | Saved views, density toggle, keyboard-first navigation | AG Grid state persistence, Astryx conventions | Patterns, not components: density toggle drives the existing density motion principle; saved views persist grid/filter state. |

## Sequencing recommendation

1. **Wrap what exists** (#3, #11, meter, pin-input) — days, not weeks.
2. **NumberField + TagsInput** (#2, #4) — completes the ERP form story.
3. **DataGrid** (#1) — the big rock; decide TanStack-headless vs SVAR first.
4. **Tree, Stepper** (#5, #6).
5. **PowerSearch + shell patterns** (#7, #12) — after the grid exists to filter.

## Appendix: full Astryx ↔ Bedrock diff (2026-08-31)

Astryx inventory: astryx.atmeta.com/components (~68 families + ~35 hooks).
Bedrock: 55 families in `src/lib/bedrock/ui/`.

**Already covered (≈40 families).** Aspect Ratio, Avatar, Badge, Breadcrumbs,
Button/ButtonGroup/Toggle(Group), Calendar, Card, Carousel, Checkbox,
Collapsible, Command Palette, Context Menu, Dialog/AlertDialog,
Divider(=Separator), Dropdown Menu, Empty State, Field/InputGroup, HoverCard,
Item(=List), Kbd, Pagination, Popover, Progress, Radio, Resizable, Skeleton,
Slider, Spinner, Switch, Table (markup only), Tabs, TextArea, TextInput,
Toast(=Sonner), Tooltip, BottomSheet(=Drawer), SideNav(=Sidebar),
TopNav(=NavigationMenu/Menubar), SegmentedControl(≈ToggleGroup).

**Missing and worth adding — beyond the gap list above:**

| Component | Verdict |
|---|---|
| **Combobox/Typeahead** | Real gap — Bedrock has no combobox family at all. bits-ui ships the primitive; wrap it. Prerequisite for MultiSelect (#4) and PowerSearch (#7). |
| **Avatar Group + Overflow** | Assignee stacks ("+3") are everywhere in business apps. Small composition on Avatar. |
| **Overflow List** | Responsive "show what fits, collapse rest into a menu" — powers toolbars, badge rows, tab strips. One good `useOverflow`-style attachment, reused widely. |
| **Banner** | App/page-level notice; `Alert` is inline and doesn't cover it. |
| **Status Dot, Timestamp** | Already in gap list (#8); confirmed no equivalent exists. |
| **VisuallyHidden** | Tiny a11y utility, cheap, should exist. |
| **Utility hooks** | Svelte-flavored `bedrock/hooks`: hotkeys, clipboard-copy, long-press, overflow measurement, scroll-lock. Astryx ships ~35; we need maybe 6. |

**Astryx's Table strategy validates ours.** Astryx has no monolithic data
grid — it ships headless `useTable*` hooks (sorting, filtering, pagination,
column resize, sticky columns, selection, row expansion, grouping, tree
data) over plain Table markup. That is exactly the TanStack-headless path in
gap #1, and an argument against adopting a monolithic grid.

**Deliberately not adding:**

- **Layout primitives** (Stack/HStack/VStack/Grid/Center/Section) — exist in
  Astryx because StyleX has no utility classes. Tailwind is our layout
  language; wrapping flexbox in components would fight the idiom.
- **Typography wrappers** (Text, Heading, Link, Icon, Blockquote) — same
  reason; Tailwind + lucide cover it.
- **Chat suite** (15 components) — Astryx's AI-first bet. Not ERP-core;
  revisit only if Bedrock grows an assistant surface.
- **Markdown, Code Block, Citation, Outline** — content/docs-site concerns,
  not design-system primitives.
- **Lightbox, Thumbnail** — defer until an attachment-preview story exists.
- **App Shell as a component** — ship as a documented Sidebar+TopNav
  composition (a "block"), not a component family.
- **Imperative dialog hooks** (`useImperativeDialog`) — un-idiomatic in
  Svelte; state-driven dialogs stay the pattern.

## Motion note

ERP surfaces are where motion restraint pays: grids, keyboard traversal, and
live data stay immediate (see the motion system plan). Motion budget goes to
state changes the user caused — row insertion/removal, step transitions,
validation reveal, optimistic-save feedback.
