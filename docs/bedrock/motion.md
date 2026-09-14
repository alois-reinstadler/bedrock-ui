# Opt-in Astra Motion integration

The `/motion` comparison uses the real packed Astra package from
`vendor/astra-motion-0.0.1.tgz`. It does not alias sibling repository source.
Ordinary Bedrock primitives remain unchanged. Import these wrappers only where
animation is wanted:

```svelte
<script lang="ts">
	import { CssButton, CssPanel } from '#lib/bedrock/motion/css.js';
	let open = $state(true);
</script>

<CssButton onclick={() => (open = !open)}>Toggle</CssButton>
{#if open}
	<CssPanel
		motion={{
			initial: { opacity: 0, y: 12 },
			animate: { opacity: 1, y: 0 },
			exit: { opacity: 0, y: -12 },
			transition: { duration: 0.2 }
		}}>Content</CssPanel
	>
{/if}
```

The API and timing units match Astra's existing API: `initial`, `animate`, `exit`
and `transition`, with **seconds** for duration/delay. `CssPanel` owns a native div
and installs the global Svelte transition, so an ancestor conditional retains the
panel during exit. `CssButton` forwards attachments through the existing Button
and synchronizes its disabled state. Native `onclick` supplies pointer, Enter and
Space activation. CssButton supplies state feedback, not exit retention for a
native element hidden inside another component.

For native markup, import `createMotion` directly from `astra-motion/css` and spread
`binding.props`; install `transition:bindingTransition` using a local alias for
`binding.transition`. For springs/projection, import from
`#lib/bedrock/motion/engine.js`. Existing `Motion` also accepts
`motion={{ engine: 'css', ...options }}`. A CSS-only application should use the
separate CSS import to exclude Motion modules from its browser graph; the comparison
page intentionally imports both backends.

CSS supports finite scalar opacity, pixel x/y/width/height/borderRadius, scale,
rotation, static variants and hover/tap/focus targets. It rejects spring/inertia,
drag, projection, MotionValues, keyframe arrays, dynamic variants, repeats,
transitionEnd, stagger and per-frame callbacks. A native intro snapshots its
trajectory; reactive animate changes wait until introend. Imperative animate()
rejects during an intro or retained exit; stop() freezes state interpolation only.
Keep positioning primitives and their animation surfaces separate when they own
the same CSS properties.

`MotionConfig` can supply reduced-motion policy to both backends. The comparison's
Reduce motion control wraps both columns in this provider. Provider spring defaults
need a local finite tween override on CSS bindings. The optional
`astra-motion/css/styles.css` presets are available for CSS-only starting styles,
disclosures, Bits height keyframes and decorative scroll motion; the binding API
does not need that stylesheet or a preprocessor.

## Dependency and refresh contract

Svelte is now `^5.57.0` to satisfy Astra's peer requirement and keep one host Svelte
runtime. Kit remains the existing `3.0.0-next.25`, now pinned so adding the package
does not silently advance the `next` tag. The checked-in generated component
reference was regenerated against the new Svelte types.

Astra's optional Kit peer is currently `^2.70.3`, so pnpm reports a peer warning
in this Kit 3 app (other existing packages also report Kit peer warnings). The CSS
and state/layout entries do not import Kit. This integration qualifies those paths;
it does not claim Kit 3 support for `astra-motion/routes`. Keep route transitions
on the app's current mechanism until the route entry is separately qualified.

To refresh from a changed Astra checkout, run `pnpm pack` there, copy the resulting
archive over this vendor file, then run `pnpm install --force` here. `--force`
refreshes the installed copy of the same-version file archive. Use this checkout's
existing pnpm store when its node_modules was installed with a different global
store setting. Re-run check/build and `/motion` browser assertions before accepting
the refreshed package. For distribution outside this workspace, publish/version
the package deliberately rather than assuming the registry name is this project.

See the sibling Astra repository's `docs/research/css-native-review.md` for the
consolidated criticism, supported contract and preprocessor assessment, and
`docs/research/css-native-validation.md` for actual checks and limitations.
