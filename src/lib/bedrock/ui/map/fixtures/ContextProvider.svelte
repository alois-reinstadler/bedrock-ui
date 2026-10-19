<script lang="ts">
	import type { Map } from 'maplibre-gl';
	import { setMapContext, type useMap } from '../use-map.svelte';
	import ContextProbe from './ContextProbe.svelte';
	let {
		map = null,
		loaded = false,
		ready = false,
		theme = 'light',
		report
	}: {
		map?: Map | null;
		loaded?: boolean;
		ready?: boolean;
		theme?: 'light' | 'dark';
		report: (context: ReturnType<typeof useMap>) => void;
	} = $props();
	setMapContext({
		moveCamera: (options) => {
			map?.easeTo(options);
		},
		getMap: () => map,
		isLoaded: () => loaded,
		isStyleReady: () => ready,
		resolvedTheme: () => theme
	});
</script>

<ContextProbe {report} />
