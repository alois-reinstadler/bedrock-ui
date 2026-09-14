# Astra Motion in Bedrock

Bedrock uses Astra for motion. The default entry is CSS; use the JS entry for
physics, automatic layout projection, shared elements, or MotionValues. There is
no second Bedrock animation engine or compatibility layer.

```svelte
<script lang="ts">
	import { Motion, MotionConfig } from '#lib/bedrock/motion/index.js';
	let open = $state(false);
</script>

<MotionConfig reducedMotion="user">
	<button aria-expanded={open} onclick={() => (open = !open)}>Show details</button>
	{#if open}
		<Motion
			as="section"
			motion={{
				initial: { opacity: 0, y: 8 },
				animate: { opacity: 1, y: 0 },
				exit: { opacity: 0, y: -8 },
				transition: { duration: 0.18 }
			}}>Details</Motion
		>
	{/if}
</MotionConfig>
```

`Motion` from `index.js` or `css.js` is a thin native-element wrapper over
`astra-motion/css`. It supports Astra's `as`, `motion`, native attributes, children,
and `bind:ref` conventions. Changing `as` requires remounting with `{#key tag}`.
`CssButton` retains Bedrock Button variants and sizes; `CssPanel` is a div convenience
wrapper. Native button clicks own pointer, Enter, and Space activation. A button
with `href` remains a native link: pointer and Enter activate; Space scrolls.

For a spring, import `Motion` from `#lib/bedrock/motion/engine.js` and pass
`transition: { type: 'spring', stiffness: 380, damping: 28 }`. For automatic layout,
use `createLayout` from `projection.js`; `scroll.js` and `values.js` provide their
corresponding narrow Astra capabilities. `config.js` exposes shared MotionConfig.
These are local source aliases, not a published Bedrock package.

## Choose by behavior

| Behavior                                                   | Backend |
| ---------------------------------------------------------- | ------- |
| Opacity, translation, scale, rotation, finite numeric size | CSS     |
| Hover, press, focus feedback; measured active indicators   | CSS     |
| Enter/exit with native Svelte retention                    | CSS     |
| Spring interruption and velocity                           | JS      |
| Measured intrinsic shells (`Size`)                         | CSS     |
| Reordering, shared-element projection                      | JS      |
| Drag, MotionValues, scroll-linked motion                   | JS      |

Use `Size` from the default or CSS entry for bounded intrinsic shells. It measures
natural content with ResizeObserver and gives numeric dimensions to Astra CSS.
Use `axis="block"` with a constrained width for wrapping content; `both` measures
max-content width. The axis is fixed per instance; use `{#key axis}` to change it.
`contentClass` styles the inner content. It does not scale text.

Both binding APIs and Size use **seconds** for duration/delay. The low-level
Svelte `cssTransition` helper instead uses **milliseconds** and needs an explicit
`reducedMotion` option when using an application preference; it does not inherit
MotionConfig. CSS theme variables such as
`--motion-state` remain native CSS values; they are styling tokens, not another
runtime. Component state timers (for example AsyncButton resetAfter) still use
milliseconds because they schedule application state, not animation.

CSS rejects springs/inertia, projection, dynamic variants, keyframe arrays,
MotionValues, repeats, stagger and per-frame callbacks instead of approximating them.
A CSS intro snapshots its trajectory; reactive targets wait until intro completion.
Imperative animate rejects during an intro or retained exit. The backend is fixed
for a binding's lifetime: remount when changing it.

## Migration from the removed Bedrock engine

The old `appear`, `reveal`, `vanish`, `drawer`, `Swap`, `autoSize`, `layout`,
`createLayoutGroup` and `LayoutGroup` exports have been removed deliberately.

- Replace finite presence transitions with CSS Motion and `initial/animate/exit`.
- Replace keyed Swap with native keyed blocks and CSS Motion. Use Astra Presence
  for coordinated branches when needed.
- Replace bounded intrinsic `autoSize` shells with CSS `Size`.
- Replace shared-layout groups with Astra `createLayout`; attach its returned factory to participants. The controller has
  `update` and `stats`, not the removed `bindRoot`/`destroy` APIs.
- Replace measured finite indicators with reactive CSS `createMotion` targets.
- Convert previous millisecond animation durations: 200 becomes 0.2 seconds.
- Replace OS-only helpers with Astra policy or reactive binding policy as appropriate.

The production components and lab routes have been migrated together. Historical
motion reports describe the removed implementation and are not current API guidance.

## Accessibility and ownership

Motion follows the OS preference by default. `MotionConfig reducedMotion="always"`
provides an application reduce-motion setting; `user` follows the OS; `never`
overrides it and should not be a normal product default. Reduction settles the
requested final state without interpolation; it must not reset meaningful geometry.
Both backends respond to policy. CSS wrapper defaults keep essential SSR content
visible; choose an explicit invisible entrance only when appropriate.

Focus and semantic state do not wait for animation. Move focus to a surviving
control when removing focused content. Native Svelte transitions own exit retention.
Keep positioning transforms and motion on separate surfaces. In particular, animate
an inner surface of popovers/tooltips, and do not give CSS and JS projection ownership
of the same property. Observers and attachments must clean up on unmount.

## Package maintenance

The pinned archive `vendor/astra-motion-0.0.1.tgz` is independently maintained Astra,
not a copy of its implementation inside Bedrock. `vendor/astra-motion.json` records
SHA-256 and source provenance. The prerequisite includes uncommitted upstream CSS
work; its base commit alone does not reproduce the archive.

Install with `pnpm install --frozen-lockfile` (`--frozen-lockfile` prevents dependency
resolution changes). Run `pnpm motion:verify` to validate archive and installed
metadata/content, export targets, and all integration bundle boundaries. Default,
CSS and config entries must contain no rendered Motion JS runtime modules.

Refresh by packing a reviewed Astra checkout with `pnpm pack`, updating the archive,
dependency path when versioned, and provenance hash/source state. Run
`pnpm install --force` (`--force` refreshes a same-version archive), then package,
unit, typecheck, lint, build and browser checks. Use the existing checkout's pnpm
store instead of purging a shared installation.

Astra's optional route adapter declares Kit 2 support; this site uses Kit 3 and does
not import that adapter. The upstream license remains unspecified. This integration
does not publish a package or grant a license.

See the [migration verification report](astra-integration/migration.md) for decisions
and verified outcomes, the `/docs/motion` guide, and the `/motion` interactive examples.
