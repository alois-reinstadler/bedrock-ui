# Layout Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement remaining tasks after reviewing this plan and the POC. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Status:** Architecture locked for review. A working POC already lives at `src/lib/bedrock/motion/*` and `src/routes/demo/ui/+page.svelte`. Remaining tasks below are the production-hardening work, not a rewrite of the approach unless review rejects it.

**Goal:** Give Bedrock a Framer Motion–style layout animation primitive so elements interpolate size and position when layout changes (flex/grid packing, reorders, shared-element morphs), instead of jumping.

**Architecture:** Custom FLIP engine (First / Last / Invert / Play) scoped by a `LayoutGroup` component, applied to nodes with a Svelte 5 `{@attach layout()}` attachment. Previous untransformed layout boxes are cached per node; after DOM mutations the engine measures the new layout, inverts with `transform`, and plays with the Web Animations API. Shared elements use a short-lived `layoutId` snapshot transferred from the departing node to the arriving node.

**Tech Stack:** Svelte 5.56 attachments + `createContext`, Web Animations API, CSS `linear()` spring sampling, Tailwind v4 tokens already in `src/routes/layout.css`. No new runtime dependencies.

## Global Constraints

- Svelte 5 runes only. `{@attach}` over `use:` actions. No `on:` / `export let` / stores for this feature.
- Animate `transform` and `opacity` only. Never animate `top`, `left`, `width`, or `height` in the engine.
- Honor `prefers-reduced-motion: reduce` by skipping playback and committing the new layout immediately.
- Do not take a Motion+ dependency. `animateLayout` from `motion-plus` is paid early access and is not acceptable for this design system.
- Do not use React `framer-motion`. This is a SvelteKit app.
- Public imports go through `#lib/bedrock/motion`. shadcn files stay untouched.
- Layout attachments must be created in component `<script>` (stable function identity), not as fresh `{@attach layout()}` calls that would re-bind on unrelated state.
- Nested `layout()` on both parent and child in the same group is out of scope for v1 (projection tree). POC demos must not nest layout nodes.

---

## Problem statement

Framer Motion’s `layout` / `layoutId` do three things Svelte does not:

1. **In-tree layout:** when an element’s box moves or resizes because of siblings, flex/grid, or class changes, interpolate from the old box to the new box.
2. **Shared layout:** when one node unmounts and another mounts with the same id, morph between those boxes (the sliding pill, the card-to-detail).
3. **Unanimatable CSS:** interpolate the visual result of values CSS cannot tween (`justify-content: start` → `end`, grid column span, wrapping).

Svelte’s `animate:flip` only runs on keyed `{#each}` reorders of immediate children. It does not animate size, shared elements, or flex/grid packing caused by filter/insert/class changes.

That gap is the product.

## Approaches considered

### A. Svelte `animate:flip` only

Insufficient. Reorder-only, list-only, position-only. Rejected as the system primitive. Still useful as a fallback for trivial lists, but not the Bedrock API.

### B. View Transitions API (`document.startViewTransition` + `view-transition-name`)

Native shared-element morphs, including size. Excellent for **route** transitions (SvelteKit `onNavigate`). Weak as the in-app layout primitive: playback is not interruptible in the Framer sense, spring control is limited, same-document VT still needs every state mutation wrapped in `startViewTransition` + `tick()`, and Firefox support lags. Keep as a **phase 2 companion** for page transitions, not as the component API.

### C. Motion+ `animateLayout`

This is the closest upstream equivalent (`data-layout`, `data-layout-id`, wrap DOM updates). It is Motion+ (paid, early access) and requires wrapping updates. Rejected for an OSS-facing design system.

### D. Custom FLIP + WAAPI + `{@attach}` (recommended, implemented in POC)

Matches Framer’s mental model, zero new deps, interruptible, group-scoped, works for class-driven flex/grid changes via MutationObserver. Hard parts (projection tree, inverse scale of children, border-radius correction) are explicit follow-ups rather than blockers for a useful v1.

### E. Hybrid later

FLIP for in-tree component layout. View Transitions for navigations. Do not mix both on the same node in the same frame.

**Recommendation:** D for the Bedrock primitive. B as a later kit-level navigation helper. Reviewers should object here if they want VT as the only engine.

## Why FLIP, precisely

CSS cannot interpolate layout. FLIP fakes it:

1. **First** — last committed layout box (viewport coordinates, **untransformed**). If an animation is in flight, use the current **visual** box (`getBoundingClientRect()`, which includes the invert transform) so the motion is interruptible.
2. **Last** — after the DOM change, clear `transform`, measure `getBoundingClientRect()`, restore.
3. **Invert** — `translate(dx, dy) scale(sx, sy)` with `transform-origin: 0 0` so the node looks like it is still at First.
4. **Play** — WAAPI from that invert to `transform: none`.

Critical detail: MutationObserver fires **after** the jump. You cannot use the post-mutation visual rect as First; it is already Last. First must be the cached `lastLayout` from the previous commit. This is the bug almost every naive FLIP port hits.

Scroll must update `lastLayout` **without** playing, otherwise scrolling looks like a layout animation.

Self-inflicted `style` mutations from setting `transform` must not re-enter the observer (use an `applying` flag).

## Public API (v1)

```svelte
<script lang="ts">
	import { LayoutGroup, layout } from '#lib/bedrock/motion';

	const item = layout();
	const pill = layout({ id: 'active-pill', type: 'position' });
</script>

<LayoutGroup class="flex gap-2">
	<button {@attach pill}>…</button>
	{#each items as entry (entry.id)}
		<article {@attach item}>{entry.label}</article>
	{/each}
</LayoutGroup>
```

| Export | Kind | Role |
| --- | --- | --- |
| `LayoutGroup` | component | Sets context, observes a real DOM root, must be the layout container (flex/grid parent), not `display: contents` |
| `layout(options?)` | attachment factory | Call **once in `<script>`**. Same function can be attached to many elements |
| `LayoutOptions.id` | `string` | Shared-element key (`layoutId`) |
| `LayoutOptions.type` | `'both' \| 'position' \| 'size'` | `position` avoids text stretch; default `both` |

`setContext` cannot run inside an attachment (attachments run in effects). That is why the group is a component, not `{@attach layoutGroup()}`.

## File map

| File | Responsibility |
| --- | --- |
| `src/lib/bedrock/motion/layout-math.ts` | Pure invert math, significance epsilon, spring `linear()` sampler |
| `src/lib/bedrock/motion/layout-math.test.ts` | Node vitest for math |
| `src/lib/bedrock/motion/layout.svelte.ts` | Group engine, observers, shared snapshot map, WAAPI playback |
| `src/lib/bedrock/motion/layout-group.svelte` | Context provider + observed root |
| `src/lib/bedrock/motion/index.ts` | Public barrel |
| `src/routes/demo/ui/+page.svelte` | Interactive POC: pill, filter/shuffle, justify-content, expand |
| `src/routes/demo/+page.svelte` | Link to `/demo/ui` |

## Algorithm (engine)

On `layout()` register:

1. Measure untransformed box → `lastLayout`.
2. If `options.id` has a snapshot younger than 120ms, play First=snapshot → Last=`lastLayout`, then delete snapshot.
3. Return cleanup that writes a snapshot (visual rect) when `id` is set, removes the node, and schedules a flush so siblings can pack.

On group flush (rAF, coalesced):

1. Abort if `prefers-reduced-motion`.
2. For each node: `from = inFlight ? visualRect : lastLayout`.
3. Cancel WAAPI, clear transform, measure `to`, restore transform.
4. If delta below epsilon, set `lastLayout = to` and skip.
5. Apply type constraints (`position` forces scale 1, `size` forces translate 0).
6. `element.animate([{ transform: invert }, { transform: 'none' }], { duration, easing: springLinear, fill: 'both' })` with origin `0 0`.
7. On finish, cancel and clear inline transform. `lastLayout = to`.

Observers on the group root: `childList`, `subtree`, `attributes` filtered to `class` and `style`. ResizeObserver on the root. Window `scroll` (capture, passive) refreshes `lastLayout` only.

## Known v1 limitations (review these, do not “fix” them in the POC)

1. **No projection tree.** Parent+child both with `layout()` will double-apply transforms. Forbidden in v1.
2. **Scale distorts text and border-radius.** Use `type: 'position'` on text-heavy nodes. Inverse-scale of children is phase 2.
3. **No crossfade** when two shared-id nodes exist at once. Snapshot transfer only (depart then arrive).
4. **No `layoutScroll` compensation** beyond resetting `lastLayout` on scroll.
5. **Hover-only CSS layout** (pure stylesheet, no class/DOM mutation) will not flush. Class changes will.
6. **Spring is a sampled `linear()` curve**, not a running solver, so it cannot retarget with conserved velocity the way Framer’s spring does. Interrupt still looks correct because First becomes the visual box.
7. **Measuring with transform stripped costs layout.** Fine under ~50 nodes per group. Virtualize or split groups after that.

## POC scenes (acceptance)

Route: `/demo/ui`. Manual, not screenshot-only.

1. **Shared pill** — `layout({ id })` indicator slides between tabs. Click every tab; interrupt mid-slide by clicking another tab.
2. **Filter + shuffle** — keyed cards pack with `type: 'position'`. Filter to a subset, shuffle, restore. Cards must not jump.
3. **Unanimatable CSS** — toggle `justify-content` start/end/center on a flex row. Items must travel, not teleport.
4. **Size** — one tile expands (`type: 'both'`). Color block, not a paragraph of text (avoids selling scale-distortion as quality).

Also verify: OS reduced-motion kills playback; scroll does not fling nodes.

## Testing strategy

- **Unit (done in POC):** invert signs, epsilon, `position`/`size` constraints, spring string shape (`src/lib/bedrock/motion/layout-math.test.ts`). Run: `pnpm exec vitest run src/lib/bedrock/motion/layout-math.test.ts --project server`.
- **Component (phase 2):** browser vitest that mounts `LayoutGroup`, changes a class, asserts `getAnimations().length > 0` then settles to identity transform.
- **E2E (phase 2):** Playwright on `/demo/ui` clicking tab 1→3 and asserting the pill’s `getBoundingClientRect().left` interpolated (sample two rAF timestamps). Reduced-motion context.

Do not assert exact pixel springs; assert monotonic travel and final box.

## Accessibility and performance

- Reduced motion: no invert, no WAAPI.
- Sliding pill is visual only; the tab `button` keeps accessible name and `aria-selected`.
- Do not set `will-change` permanently. Optional during play, clear on finish.
- Grain/blur must not be applied to the animating nodes.

## Out of scope

Page transitions, AnimatePresence-style enter/exit (use Svelte `transition:`), drag-to-reorder physics, SVG layout, canvas, Motion+ integration.

---

### Task 1: Review gate (human / reviewer AI)

**Files:**
- Read: `docs/superpowers/plans/2026-08-29-layout-animations.md`
- Read: `src/lib/bedrock/motion/layout.svelte.ts`
- Read: `src/routes/demo/ui/+page.svelte`

**Interfaces:**
- Consumes: nothing
- Produces: written verdict: approve D, reject in favor of B/C, or approve D with listed deltas

- [ ] **Step 1: Run the POC**

Run: `pnpm dev` and open `/demo/ui`. Exercise all four scenes plus reduced motion.

Expected: pill, packing, justify, and expand all interpolate; interrupting the pill does not jump.

- [ ] **Step 2: Write the verdict**

Answer the review questions in the section below. If rejecting the engine, stop; do not implement Tasks 2–4.

- [ ] **Step 3: Commit is not required unless the user asks**

---

### Task 2: Inverse scale (production text)

**Files:**
- Modify: `src/lib/bedrock/motion/layout.svelte.ts`
- Test: `src/lib/bedrock/motion/layout-math.test.ts`

**Interfaces:**
- Consumes: `invertTransform(from, to)` → `{ dx, dy, sx, sy }`
- Produces: child corrector `inverseScale(parent: { sx: number; sy: number })` → `{ sx: 1/parent.sx, sy: 1/parent.sy }` applied to direct children marked `layout({ type: 'position' })` or an explicit `layoutChild` attach

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { inverseScale } from './layout-math.js';

describe('inverseScale', () => {
	it('cancels parent scale', () => {
		expect(inverseScale({ sx: 2, sy: 0.5 })).toEqual({ sx: 0.5, sy: 2 });
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/lib/bedrock/motion/layout-math.test.ts --project server`

Expected: FAIL, `inverseScale` is not exported.

- [ ] **Step 3: Implement inverse scale on registered descendants during parent play**

Apply the inverse on children for the same WAAPI duration/easing. Skip if parent `type === 'position'`.

- [ ] **Step 4: Re-run tests and the expand scene with a text label inside the tile**

Expected: PASS; label does not stretch.

---

### Task 3: Browser test for flush

**Files:**
- Create: `src/lib/bedrock/motion/layout.svelte.test.ts`

**Interfaces:**
- Consumes: `LayoutGroup`, `layout()`
- Produces: browser vitest covering MutationObserver flush

- [ ] **Step 1: Write a failing browser test** that toggles a flex class and expects a non-none transform while playing.

- [ ] **Step 2: Run** `pnpm exec vitest run src/lib/bedrock/motion/layout.svelte.test.ts --project client`

Expected: FAIL until the test harness mounts correctly.

- [ ] **Step 3: Fix harness / timing (`tick` + `requestAnimationFrame`) until the test passes without flakes.**

---

### Task 4: Projection tree (only if nested layout is required)

**Files:**
- Modify: `src/lib/bedrock/motion/layout.svelte.ts`

**Interfaces:**
- Consumes: parent `LayoutNode`
- Produces: child First/Last measured in parent local space so parent scale does not double-move children

- [ ] **Step 1: Add a nested-layout fixture to `/demo/ui` that is currently forbidden.**

- [ ] **Step 2: Implement parent-relative deltas. Reject the task if still broken after one attempt and keep the v1 nesting ban.**

---

## Review questions (another AI must answer)

1. Is custom FLIP the right v1 primitive versus View Transitions-only? Why?
2. Is forbidding nested layout acceptable for a design system, or must projection land before any Bedrock component uses this?
3. Should `layout()` outside `LayoutGroup` no-op, throw, or auto-create a document-scoped group?
4. Is 120ms the right shared-id snapshot window for Svelte’s mount/unmount ordering?
5. Should springs stay as `linear()` samples or move to a per-frame solver for retargeting?
6. Any security/perf issue with MutationObserver on `style` + `class` at subtree scope?
7. Does the POC demonstrate enough of Framer’s `layout`/`layoutId` to commit to this API shape?

## Self-review

- Spec coverage: in-tree layout, shared id, unanimously CSS, reduced motion, scroll, API, limitations, tests, POC — each has a section or task.
- No TBD/placeholder implementation steps in remaining tasks.
- Types: `LayoutOptions`, `LayoutBox`, `invertTransform` are named consistently across plan and code.
