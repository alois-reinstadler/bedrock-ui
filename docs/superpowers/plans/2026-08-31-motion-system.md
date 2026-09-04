# Bedrock motion system v2

Date: 2026-08-31 · Status: design · Extends: 2026-08-29-layout-animations.md

One semantic vocabulary, four implementation layers. Every layer is
interruptible, commits final state synchronously under reduced motion, and is
driven by the presets in `src/lib/bedrock/motion/tokens.ts` — never by raw
durations in components. Designed to be extended (new presets, themes, and
principles slot in without touching component code).

## Design principles

1. **Semantic, not numeric.** Components name an intent (`press`, `overlay`,
   `swap`); tokens decide what that means. Astryx treats motion as a theme
   dimension alongside color and type — we do the same, so a future theme can
   retune the whole system from one config.
2. **CSS where CSS can, JS where it must.** Micro-interactions and overlay
   presence are pure CSS (cheapest, natively interruptible, works during
   hydration). The FLIP engine is reserved for what CSS cannot express:
   layout interpolation, shared elements, packing.
3. **Interruption is the common case.** Rapid reversal must never queue,
   stack, or teleport. This is a hard acceptance criterion per layer.
4. **Reduced motion = same information, zero choreography.** Final states
   commit synchronously; `Spinner`/`Skeleton` stop; nothing is hidden that
   motion would have revealed.
5. **Immediate by default.** Dragging, scrolling, keyboard traversal, live
   data, and frequent progress updates get no transition. Motion budget is
   spent on user-caused state changes.

## Layer 0 — Tokens (single source of truth)

`tokens.ts` stays authoritative. Add a build-time emission to CSS custom
properties so every layer reads the same values:

```css
:root {
	--motion-press: 130ms;
	--motion-state: 175ms;
	--motion-enter: 230ms;
	--motion-ease-enter: cubic-bezier(0.23, 1, 0.32, 1);
	--motion-exit: 175ms;
	--motion-ease-exit: cubic-bezier(0.3, 0, 0.6, 0.6);
	--motion-reveal: 310ms;
	--motion-overlay: 410ms;
	--motion-ease-move: cubic-bezier(0.77, 0, 0.175, 1);
	--motion-ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
	--motion-ease-spring-layout: linear(…); /* spring sampled to linear() at build */
	--motion-ease-spring-swap: linear(…);
}
@media (prefers-reduced-motion: reduce) {
	:root {
		--motion-press: 0.01ms; /* …all durations; 0.01ms keeps transitionend firing */
	}
}
```

Spring presets compile to CSS `linear()` easing strings with the same sampler
the engine already uses — one spring definition, usable from both CSS and
WAAPI. Generation: a small script (`pnpm motion:tokens`) writes
`src/lib/bedrock/motion/tokens.css`, checked in and diffed in CI so drift is
impossible.

**Preset additions.** Split `overlay` into weight classes — 410ms is right
for `Dialog`/`Sheet`, wrong for menus:

- `overlay` (410ms): Dialog, AlertDialog, Drawer, Sheet
- `popover` (enter 200ms / exit 150ms): Popover, HoverCard, Select,
  DropdownMenu, ContextMenu, Menubar, Command
- `hint` (enter 140ms / exit 100ms): Tooltip

**Theming hook (later).** A theme overrides the custom properties only; JS
consumers read resolved values via `getComputedStyle` at animation start, so
themes retune FLIP too without new code.

## Layer 1 — CSS micro-interactions

Semantic utility classes in a `@layer bedrock.motion` stylesheet, replacing
every `transition-all` and raw `duration-*` in the Bedrock layer:

- `.motion-press` — transform/opacity on active, `var(--motion-press)`
- `.motion-state` — color/background/border/opacity, `var(--motion-state)`
- `.motion-overlay` / `.motion-popover` / `.motion-hint` — driven by bits-ui
  `data-state="open|closed"`, using `@starting-style` for entry and
  `transition-behavior: allow-discrete` so `display`/`overlay` transitions
  work without forceMount hacks
- `.motion-reveal` — intrinsic size via `interpolate-size: allow-keywords`
  (height `auto` animation in pure CSS); `auto-size.ts` remains the fallback
  for browsers without support and for interruption-sensitive cases

This layer handles the press/state, overlay presence, and simple reveal
principles for ~25 component families with zero JS cost.

Enforcement: an ESLint rule (or a grep-based check in CI) banning
`transition-all` and `duration-[0-9]` in `src/lib/bedrock/**`.

## Layer 2 — Presence (Svelte transitions)

The existing `appear` / `vanish` / `reveal` / `drawer` transitions in
`presence.ts`, all resolving through `resolveMotionDuration` (already commits
synchronously under reduced motion). Used for in-template conditional
content: validation messages, empty states, dynamic alerts — places where
Svelte owns mount/unmount rather than a data-state attribute.

Additions:

- Reactive reduced-motion via `MediaQuery` from `svelte/reactivity` (policy
  currently reads once per transition; a `MediaQuery` instance makes the
  preference reactive for long-lived components like `Spinner`).
- All transitions stay `css`-function based (never `tick`) so Svelte can
  reverse them natively on interruption.

## Layer 3 — Layout (FLIP engine)

`LayoutGroup` + `{@attach layout(...)}` + `Swap` — already attachment-based,
which is the right modern Svelte API. Covers: shared selection indicator,
packing/insertion, keyed swap, shared-element, density reflow, shell morph.

**Gate: engine hardening (M2) ships before any component rollout.** Open
defects from the 2026-08-30 adversarial review:

1. Capture-phase scroll cancels + snaps all in-flight FLIP group-wide.
2. Unrelated mutation in a group restarts every in-flight spring (500ms
   preset stretches to ~1.2s under repeated mutations).
3. Nested child with shorter `transition.duration` than its ancestor
   teleports backwards when its animation clears.
4. Guard recovery leaks `pendingMode='animate'`.
5. Mount+unmount-between-flushes shared owner publishes never-painted
   geometry.
6. Perf: `startJobs` interleaves `getComputedStyle` with `animate()` per
   node — batch all reads before all writes (~55ms flush at 50 nodes today).

## Layer 4 — Orchestration (the latest-Svelte layer)

Where Svelte 5.36+ features buy polish nothing else can:

**Async boundaries as motion surfaces.** With `experimental.async` (already
on 5.56), loading→content becomes a first-class transition point:

```svelte
<MotionBoundary preset="swap">
	{#snippet pending()}<Skeleton … />{/snippet}
	<OrderTable rows={await getOrders()} />
</MotionBoundary>
```

`MotionBoundary` wraps `<svelte:boundary pending>` and cross-fades
skeleton→content with the `swap` preset, plus an anti-flicker policy: show
the pending snippet only after 150ms, keep it at least 300ms once shown.
`$effect.pending()` drives inline busy states (async `Button` labels) the
same way. This is the "loading-empty-success" principle done structurally
instead of per-component.

**View Transitions API for navigation.** SvelteKit `onNavigate` +
`document.startViewTransition` for route-level transitions, honoring reduced
motion. Later: bridge FLIP shared ids to `view-transition-name` so a `Card`
can hand off to a detail _route_, not just a detail dialog.

**`Spring`/`Tween` classes from `svelte/motion`** for value animation —
animated numbers in stat tiles, smoothed `Progress` (when updates are
sparse), `Spring.of(() => value)` for derived targets. These replace any
temptation to run the FLIP engine for non-layout values.

**Attachments as the universal opt-in.** Everything user-facing is an
attachment or a component: `{@attach layout()}`, `{@attach autoSize()}`,
future `{@attach pressFeedback()}`. `fromAction` covers any third-party
action we want to absorb.

## Component API convention

Bedrock components expose one optional prop:

```ts
motion?: false | { preset?: keyof typeof motionPresets }
```

`false` opts out (renders immediate); the object form overrides the preset.
Nothing else — durations and easings are never props.

## Component mapping (2026-08-31, per Astryx motion doc + demo/ui scenes)

Astryx principles applied throughout: exits are optional (tooltips/menus may
vanish instantly), entrance/exit direction must match, direction reinforces
navigation, overlays originate from their trigger, and high-frequency
interactions (row hover, keyboard traversal, streaming) never animate.
Our token ladder is literally Astryx's: press 130 = `fast-min`, state 175 =
`fast`, enter 230 = `fast-max`, reveal 310 = `medium-min`, overlay 410 =
`medium`.

**Selection indicator — `layout()` shared pill (scene 01, 08):**
`Tabs` (active pill), `ToggleGroup`, `NavigationMenu`/`Menubar` active item,
`Sidebar` active rail marker, `DataTable` view tabs (once built). Move
easing / swap spring.

**Reveal, intrinsic size — `autoSize` + `reveal` 310 (scenes 04, 05, 14):**
`Accordion`, `Collapsible`, `Field`/`Form` validation messages
(appear/vanish + height), dynamic `Alert`/`Empty`, `Banner` (enter 230 from
top; on close, exit 175 + height collapse so content below doesn't jump),
`Combobox`/`Command` content height tracking while filtering (scene 07
search morph).

**Overlay presence — CSS data-state, origin from trigger:**
`Dialog`/`AlertDialog` overlay 410 in / exit 175 out; `Popover`, `HoverCard`,
`DropdownMenu`, `ContextMenu`, `Select`, `Combobox.Content` enter 230 with
`--bits-*-transform-origin`, exit instant-or-100ms (Astryx exit-optional);
`Tooltip` enter 130–175, exit instant; `Sheet`/`Drawer` drawer easing 410
with matched exit direction; `Lightbox` overlay 410 + `Swap` on prev/next;
`Sonner` enter 230 slide+fade, stack packing via `layout()`.

**Packing, insertion/removal — `layout()` (scenes 02, 10, 11):**
`OverflowList` repack on resize/collapse, `AvatarStack` membership changes,
opt-in `Badge`/`Item`/`Card` collections, `DataTable` single-row
insert/remove and the bulk-actions bar (appear + count swap) — but NOT
sort/filter/pagination re-renders (immediate per standards), `Chat`
new-message entrance (enter 230 slide-up; streaming text never animates).

**Keyed swap — `Swap` (scene 13):**
Async `Button` labels (Speichern → Spinner → Check), `Calendar`/
`RangeCalendar` month transitions (directional — forward slides forward),
`Tabs`/future `Stepper` panel content (directional), `Avatar`
image↔fallback crossfade (state 175), `DataTable` selected-count numeral.

**Press/state — CSS only, press 130 / state 175:**
`Button`, `Toggle`, `Checkbox`, `Switch` (thumb, ease-standard),
`RadioGroup`, `InputOTP`, chat send button.

**Shared element — opt-in `LayoutGroup` ids (scene 09):**
`Thumbnail` → `Lightbox` image, `Card`/`Item` → detail `Dialog`/`Sheet`,
later `DataTable` row → detail panel.

**Explicitly immediate:** table sort/filter/page re-renders, row hover,
`ScrollArea`, `Slider`/`Resizable`/`Carousel` while dragging, text inputs,
keyboard highlight traversal in menus/`Command`, `Progress` under frequent
update, `Timestamp` ticks, `Skeleton`/`Spinner` (existing restrained motion,
stopped under reduced motion).

FLIP-dependent entries (indicator, packing, shared element) remain gated on
the M2 engine hardening above; CSS/`Swap`/presence entries can ship first.

## Phasing

| Phase | Scope                                                                                                                                | Gate                                            |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| 1     | Token→CSS emission, Layer 1 utilities, preset split (`popover`/`hint`), press/state + overlay + reveal rollout, `transition-all` ban | `pnpm check` + visual pass on /demo/ui          |
| 2     | Engine hardening M2 (defects 1–6), batched read/write flush                                                                          | CDP frame-sampling verification, stress fixture |
| 3     | FLIP rollout: indicator, packing, swap, shared-element per the approved mapping                                                      | Interrupt/reversal acceptance per component     |
| 4     | MotionBoundary, `$effect.pending` busy states, View Transitions bridge                                                               | Reduced-motion + async-flicker audit            |

Verification caveat: this container exports `NODE_ENV=production`, so the
engine's dev-only warnings are dead here and true dev SSR is broken — Phase 2
must either fix the dev-mode SSR crash or verify via prod builds + CDP.
