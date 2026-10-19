# Bedrock motion: CSS, coordination, and Astra integration

Start with the [component audit and recommended motion policy](motion-architecture-review.md) and
[route prototype evaluation](motion-architecture-evaluation.md). Native CSS is the default for ordinary
visuals; Bits UI presence or a small measurement helper does not imply an engine dependency. Keep
dedicated JS for coordinated local layout and shared-element routes. The route prototype uses JS
sessions and part-specific WAAPI playback, independently of ordinary components.

The audit and prototype are complete; production component migrations, unified token generation
and any local-layout backend replacement remain proposed work. The API descriptions below document
the existing integration, not the recommended default for every new animation.

The `/docs/motion` guide documents the public integration, and `/motion` provides
interactive comparisons. Bedrock keeps Astra behind explicit local entry points.
The comparison uses the real packed Astra package from
`vendor/astra-motion-0.1.0-rc.3.tgz`. It does not alias sibling repository source.
Ordinary Bedrock primitives remain unchanged. Import these wrappers only where
their explicit Astra binding behavior is needed; ordinary CSS needs no wrapper:

```svelte
<script lang="ts">
	import { MotionButton, MotionPanel } from '#lib/bedrock/motion/bindings.js';
	let open = $state(true);
</script>

<MotionButton onclick={() => (open = !open)}>Toggle</MotionButton>
{#if open}
	<MotionPanel
		motion={{
			initial: { opacity: 0, y: 12 },
			animate: { opacity: 1, y: 0 },
			exit: { opacity: 0, y: -12 },
			transition: { duration: 0.2 }
		}}>Content</MotionPanel
	>
{/if}
```

The API and timing units match Astra's existing API: `initial`, `animate`, `exit`
and `transition`, with **seconds** for duration/delay. `MotionPanel` owns a native div
and installs the global Svelte transition, so an ancestor conditional retains the
panel during exit. `MotionButton` forwards attachments through the existing Button
and synchronizes its disabled state. Native `onclick` supplies pointer, Enter and
Space activation for buttons. With `href`, it renders a native link, activated by
pointer or Enter; Space retains browser scrolling behavior. MotionButton supplies state feedback, not exit retention for a
native element hidden inside another component.

## Public API and compatibility

`#lib/bedrock/motion/index.js` remains the native Bedrock entry: `appear`,
`reveal`, `drawer`, `vanish`, `LayoutGroup`, `Swap`, and related utilities keep
their existing signatures and **millisecond** durations. There is no automatic
migration or substitution of these APIs. Astra duration and delay use seconds;
convert 200 milliseconds to 0.2 seconds when explicitly adopting its APIs.

Use `#lib/bedrock/motion/config.js` for `MotionConfig` for scoped configuration. Ordinary UI imports do not opt into the Astra engine. Bedrock is an
in-tree design system: these `#lib` paths are source aliases in this repository,
not exports from a published Bedrock package.

Narrow Astra capabilities are available through `projection.js` (layout),
`values.js` (MotionValues), and `scroll.js`. These remain explicit opt-ins;
`projection.js` avoids colliding with Bedrock’s existing `layout.svelte.js`.
`MotionPanel` defaults to visible server-rendered content (`initial: false`); set
`initial` explicitly when an entrance is needed. Both wrappers support `bind:ref`
for application focus management.

For native markup, import `motion` from `astra-motion/state`, call `motion.bind`,
spread `binding.props`, and install `binding.transition` through a local alias as a
global Svelte transition. The native binding and component APIs both use Astra's
animation engine. Use plain CSS for engine-free feedback.

RC3 removed the experimental `astra-motion/css` entry. Bedrock's old `css.js`
entry, `CssButton`, `CssPanel`, and `createMotion` names remain compatibility
aliases to the new bindings, but no longer promise a CSS-only implementation or
its former option restrictions. Prefer `bindings.js`, `MotionButton`, and
`MotionPanel` for new code. `engine.js` also retains the old `createMotion` factory
alias; upstream's native factory is now `motion.bind`.

## Accessibility and ownership

Astra defaults to the operating system preference (`reducedMotion="user"`).
`MotionConfig` can supply reduced-motion policy to Astra bindings and components.
`always` requests reduced motion regardless of OS settings; `never` overrides
the OS preference and should not be a normal product default. The provider is
scoped to its descendants and does not reconfigure native Bedrock transitions.
Keep focus restoration and semantic state independent of animation completion.
A retained exiting panel may still contain focusable children: move focus to its
trigger and disable departing controls where the interaction requires it.

The comparison's Reduce motion control wraps both examples in this provider.
Reduced motion follows RC3 policy: spatial animation is reduced while opacity
feedback can still animate.

## Dependency and refresh contract

Svelte is now `^5.57.0` to satisfy Astra's peer requirement and keep one host Svelte
runtime. Kit remains the existing `3.0.0-next.25`, now pinned so adding the package
does not silently advance the `next` tag. The checked-in generated component
reference was regenerated against the new Svelte types.

Astra's optional Kit peer is currently `^2.70.3`, so pnpm reports a peer warning
in this Kit 3 app (other existing packages also report Kit peer warnings). The native binding
and state/layout entries do not import Kit. This integration qualifies those paths;
it does not claim Kit 3 support for `astra-motion/routes`. The [route evaluation](motion-architecture-evaluation.md) instead recommends a dedicated JS
coordinator with WAAPI playback. Astra's route wrapper uses browser View Transitions and does not
provide the required interrupted image/surface/title continuity; peer compatibility alone would not
resolve that architectural mismatch. The prototype is not yet a production Bedrock route API.

Fresh checkouts install with `pnpm install --frozen-lockfile`;
`--frozen-lockfile` prevents dependency-resolution changes. Run
`pnpm motion:verify` to check the installed package contract.

Archive provenance and its SHA-256 digest are recorded in `vendor/astra-motion.json`.
The RC3 archive was packed from clean upstream commit
`2acb6b2` (see the manifest for the full commit). The upstream prepack script
validates generated elements, builds the package and embedded engine, and runs
strict publint. The verifier checks archive and installed metadata/content, export
targets, and bundled entry points. Legacy Bedrock imports must remain engine-free;
Astra binding and configuration imports may include the packaged engine.

To refresh, run `pnpm pack` in a reviewed Astra checkout, copy the resulting archive
into vendor, and update the dependency path and provenance manifest. Run
`pnpm install`, `pnpm motion:verify`, `pnpm check`, `pnpm build`, and the existing
`/motion` browser assertions. Fresh checkouts require no sibling repository.

Upstream RC3 declares the MIT license and includes its LICENSE in the archive.

The [original integration report](astra-integration/verification.md) documents
historical CSS-backend behavior and is not the RC3 contract.
