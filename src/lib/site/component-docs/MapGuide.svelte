<script lang="ts">
	import { CodeBlock } from '#lib/bedrock/ui/code-block';
	import { Heading } from '#lib/bedrock/ui/heading';
	import quickstart from '#lib/site/previews/map.svelte?raw';
	import lazyExample from '#lib/site/map-examples/LazyMapExample.svelte?raw';
	const installCommands = 'pnpm add maplibre-gl@6.7.0\npnpm add -D @types/geojson';
</script>

<section id="map-quickstart" aria-labelledby="map-quickstart-heading" class="space-y-4">
	<Heading id="map-quickstart-heading" level={2}>Create a map</Heading>
	<p class="text-sm leading-relaxed text-muted-foreground">
		Map is a Bedrock component family powered by MapLibre. When copying it into another project,
		copy the map directory with its Bedrock utilities and install the rendering dependency and
		GeoJSON types. The -D flag installs development-only TypeScript types.
	</p>
	<CodeBlock code={installCommands} language="bash" title="Dependencies" />
	<p class="text-sm leading-relaxed text-muted-foreground">
		Give the parent an explicit height. Coordinates always use [longitude, latitude]. This example
		adds navigation controls and a keyboard-accessible marker with a popup. The Preview at the top
		of this page runs this exact code.
	</p>
	<CodeBlock code={quickstart} language="svelte" title="Map with a marker" />
	<p class="text-sm leading-relaxed text-muted-foreground">
		The component imports its CSS and bundles its worker through Vite. Keep the worker's
		<code>?worker&amp;url</code> import when copying the files. The default CARTO basemap needs no
		API key and follows the document's light or dark theme. Pass <code>styles</code> to use your own
		style URLs or MapLibre style objects, or <code>blank</code> for a transparent map without tiles.
	</p>
</section>

<section id="map-state" aria-labelledby="map-state-heading" class="space-y-4">
	<Heading id="map-state-heading" level={2}>State and custom layers</Heading>
	<p class="text-sm leading-relaxed text-muted-foreground">
		Use <code>bind:map</code> in a parent to call methods such as <code>flyTo</code> after the
		instance is available. The location finder below demonstrates selection from a list or marker.
		For a controlled camera, pass <code>viewport</code> and update it in
		<code>onviewportchange</code>; see Controlled viewport in the gallery.
	</p>
	<p class="text-sm leading-relaxed text-muted-foreground">
		Custom child components can call <code>useMap()</code> during component initialization. Keep the
		returned object intact so its getters stay reactive. A parent-owned snippet, event handler or
		effect cannot initialize this context hook. Use <code>context.isStyleReady</code> before adding
		custom sources and layers, restore them when styles change, and remove listeners and layers
		during cleanup. <code>context.isLoaded</code> tracks the initial map load only.
	</p>
</section>

<section id="map-lazy-loading" aria-labelledby="map-lazy-heading" class="space-y-4">
	<Heading id="map-lazy-heading" level={2}>Lazy loading</Heading>
	<p class="text-sm leading-relaxed text-muted-foreground">
		Use Map for an immediately visible primary map. LazyMap is useful for optional maps, hidden
		panels and maps further down a page: it defers the rendering engine, CSS and worker. Import from
		the separate <code>/lazy</code> entry and get controls, markers and layers from the children snippet.
		Static imports from the regular map entry load the engine early.
	</p>
	<CodeBlock code={lazyExample} language="svelte" title="Load on interaction" />
	<dl class="divide-y rounded-lg border text-sm">
		<div class="space-y-1 p-4">
			<dt class="font-code font-medium">activation</dt>
			<dd class="text-muted-foreground">
				"visible" (default) loads near the viewport; "interaction" shows a Load map button.
			</dd>
		</div>
		<div class="space-y-1 p-4">
			<dt class="font-code font-medium">rootMargin</dt>
			<dd class="text-muted-foreground">
				"200px" by default. Adjusts how close the map must be to the viewport for visible
				activation.
			</dd>
		</div>
		<div class="space-y-1 p-4">
			<dt class="font-code font-medium">placeholder</dt>
			<dd class="text-muted-foreground">
				Optional snippet for the content shown before the map loads.
			</dd>
		</div>
		<div class="space-y-1 p-4">
			<dt class="font-code font-medium">children</dt>
			<dd class="text-muted-foreground">
				Snippet receiving the loaded map family. Compose its controls and layers here.
			</dd>
		</div>
		<div class="space-y-1 p-4">
			<dt class="font-code font-medium">Map props and bind:map</dt>
			<dd class="text-muted-foreground">
				Map options, event callbacks and the instance binding pass through. Reserve height on the
				parent to prevent layout shifts. Failed module loads offer a retry.
			</dd>
		</div>
	</dl>
</section>

<section id="map-requirements" aria-labelledby="map-requirements-heading" class="space-y-4">
	<Heading id="map-requirements-heading" level={2}>Rendering and data</Heading>
	<ul class="list-disc space-y-2 ps-5 text-sm leading-relaxed text-muted-foreground">
		<li>
			Rendering needs WebGL2. Unsupported browsers show an unavailable message; keep essential
			places and actions available in a list.
		</li>
		<li>
			Basemap tiles and some gallery datasets need network access. OSRM routing uses a public demo
			service; configure your own provider for production routing.
		</li>
		<li>
			Geolocation needs browser permission and HTTPS or localhost. Other controls work without
			location permission.
		</li>
		<li>
			Custom providers may require API keys and attribution. Preserve the map's attribution control
			and follow your provider's terms.
		</li>
		<li>
			Use the Properties tab for the component API and the Accessibility tab for keyboard, focus and
			motion guidance.
		</li>
	</ul>
</section>
