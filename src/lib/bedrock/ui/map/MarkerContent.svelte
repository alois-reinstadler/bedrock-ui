<script lang="ts">
	import { getContext, getAllContexts, mount, unmount } from 'svelte';
	import Portal from './Portal.svelte';
	const contexts = getAllContexts();
	import * as MapLibreGL from 'maplibre-gl';
	import { cn } from '#lib/bedrock/utils.js';

	interface Props {
		children?: import('svelte').Snippet;
		class?: string;
	}

	let { children, class: className }: Props = $props();

	const markerCtx = getContext<{
		getMarker: () => MapLibreGL.Marker | null;
		getElement: () => HTMLDivElement | null;
		getMap: () => MapLibreGL.Map | null;
		isReady: () => boolean;
	}>('marker');

	$effect(() => {
		const element = markerCtx.getElement();
		if (!markerCtx.isReady() || !element) return;
		const instance = mount(Portal, {
			target: element,
			props: { children: content },
			context: contexts
		});
		return () => {
			void unmount(instance);
		};
	});
</script>

{#snippet content()}
	<div class={cn('relative cursor-pointer', className)}>
		{#if children}
			{@render children()}
		{:else}
			<!-- Default marker icon -->
			<div class="relative h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-lg"></div>
		{/if}
	</div>
{/snippet}
