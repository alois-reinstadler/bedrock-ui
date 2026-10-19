<script lang="ts">
	import { setContext } from 'svelte';
	import MarkerContent from '../MarkerContent.svelte';
	let {
		target,
		ready = false,
		labels = ['Vienna']
	}: { target: HTMLDivElement; ready?: boolean; labels?: string[] } = $props();
	setContext('marker', { getElement: () => target, isReady: () => ready });
</script>

<MarkerContent>
	{#each labels as label (label)}<button type="button">{label}</button>{/each}
</MarkerContent>
