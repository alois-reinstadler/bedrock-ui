<script lang="ts">
	import type { Map } from 'maplibre-gl';
	import { setMapContext } from '../use-map.svelte';
	import MapRoute from '../MapRoute.svelte';
	import MapArc from '../MapArc.svelte';
	import MapGeoJSON from '../MapGeoJSON.svelte';
	import MapClusterLayer from '../MapClusterLayer.svelte';
	let { map, ready = false }: { map: Map; ready?: boolean } = $props();
	setMapContext({
		moveCamera: (options) => {
			map?.easeTo(options);
		},
		getMap: () => map,
		isLoaded: () => true,
		isStyleReady: () => ready,
		resolvedTheme: () => 'light'
	});
	const polygon = {
		type: 'Feature' as const,
		properties: {},
		geometry: {
			type: 'Polygon' as const,
			coordinates: [
				[
					[0, 0],
					[1, 0],
					[1, 1],
					[0, 0]
				]
			]
		}
	};
</script>

<MapRoute
	id="test-route"
	coordinates={[
		[0, 0],
		[1, 1]
	]}
/>
<MapArc id="test-arc" data={[{ id: 'arc', from: [0, 0], to: [1, 1] }]} />
<MapGeoJSON id="test-region" data={polygon} />
<MapClusterLayer data={{ type: 'FeatureCollection', features: [] }} />
