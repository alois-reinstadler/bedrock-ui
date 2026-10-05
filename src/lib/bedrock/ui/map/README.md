# Bedrock Map

Map is Bedrock’s interactive map component family, powered by MapLibre. Compose controls, markers, popups, routes, arcs, GeoJSON and clusters using Svelte components. Map lives and evolves with the rest of Bedrock. There is no mapcn-svelte package dependency or separate fork to maintain.

The complete usage guide, API reference, accessibility guidance and interactive examples are at `/docs/components/map`. Source attribution is recorded in [NOTICE.md](./NOTICE.md), with the original [MIT license](./LICENSE) retained.

Install `maplibre-gl@6.7.0` and `@types/geojson` when copying this family. Map imports its own MapLibre CSS and bundles the matching worker using Vite's `?worker&url` asset import. Give the container an explicit height. Default basemaps use CARTO; supply `styles` or `blank` for your own data.

Import named components from `#lib/bedrock/ui/map` (or your application's equivalent). `Root` aliases `Map`.

## State and lifecycle

- `useMap()` must be called during initialization of a **descendant component** of Map, never inside an event handler, effect, or a snippet declared in its parent. Use `bind:map` from the parent.
- The hook uses typed, instance-scoped context and direct reactive getters, with an explicit error outside Map instead of silently returning a permanently empty map. Keep the returned object intact; destructuring its properties captures a snapshot.
- `isLoaded` means the map's initial load completed; `isStyleReady` additionally tracks style replacement. Custom sources/layers must use `isStyleReady` and clean up their listeners/layers. DOM markers survive theme changes.
- The component serves the matching worker locally and observes container resizes.
- Examples cover Map, Controls, Markers, Popups, Routes, Arcs, GeoJSON, Clusters, and Advanced. Geographic datasets, tiles and OSRM routing require network access. Locate requires browser permission and a secure context.

The location finder example combines a keyboard-accessible list with markers and camera selection; essential locations remain available when rendering is unavailable. Copyable examples cover the full component family.

Run Bedrock’s map unit and browser regressions when changing the component.

## Lazy loading

The eager family measured about 1.01 MB of minified JavaScript (263 KB gzip) in the initial Bedrock production build, excluding CSS and the worker. Lazy loading is useful for maps below the fold, hidden panels, and pages where a map is optional. Keep `Map` for primary, immediately visible maps.

Import the **separate lightweight entry** and receive components through the snippet. Importing `MapMarker` or other eager family components alongside LazyMap would load MapLibre early and defeat the split.

```svelte
<script lang="ts">
	import { LazyMap } from '#lib/bedrock/ui/map/lazy';
</script>

<div class="h-96">
	<LazyMap center={[16.3738, 48.2082]} zoom={12}>
		{#snippet children({ MapControls, MapMarker, MarkerContent })}
			<MapControls />
			<MapMarker longitude={16.3738} latitude={48.2082}>
				<MarkerContent />
			</MapMarker>
		{/snippet}
	</LazyMap>
</div>
```

The default loads within 200px of the viewport. Set `activation="interaction"` to show a Load map button, `rootMargin` to change the visibility threshold, or provide a `placeholder` snippet. Map props and `bind:map` pass through. The reserved container height prevents layout shift. Observer cleanup and a disposal guard prevent mounting after navigation. Failed imports offer a retry button. If copied into another project, use its local path to `lazy.ts`; Bedrock's `package.json` includes an explicit import mapping for the lightweight entry.

The MapLibre 6 worker imports a shared module, so the Vite import **must use `?worker&url`**, not `?url`: the latter copies the entry file without bundling its dependencies and breaks production workers.
