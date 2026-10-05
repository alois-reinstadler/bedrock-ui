<script lang="ts">
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	const motionPolicy = useMotionPolicy();
	import { getContext, getAllContexts, mount, unmount } from 'svelte';
	import Portal from './Portal.svelte';
	const contexts = getAllContexts();
	import * as MapLibreGL from 'maplibre-gl';
	import type { PopupOptions } from 'maplibre-gl';
	import { cn } from '#lib/bedrock/utils.js';

	interface Props {
		children?: import('svelte').Snippet;
		class?: string;
		offset?: PopupOptions['offset'];
		anchor?: PopupOptions['anchor'];
		maxWidth?: string;
	}

	let { children, class: className, offset = 16, anchor, maxWidth }: Props = $props();

	const markerCtx = getContext<{
		getMarker: () => MapLibreGL.Marker | null;
		getElement: () => HTMLDivElement | null;
		getMap: () => MapLibreGL.Map | null;
		isReady: () => boolean;
	}>('marker');

	let tooltip: MapLibreGL.Popup | null = null;

	// Create tooltip popup when marker is ready
	$effect(() => {
		const marker = markerCtx.getMarker();
		const markerElement = markerCtx.getElement();
		const map = markerCtx.getMap();
		const ready = markerCtx.isReady();

		if (!ready || !marker || !markerElement || !map) return;

		// Create popup container
		const container = document.createElement('div');

		// Build popup options
		const popupOptions: PopupOptions = {
			offset,
			closeOnClick: true,
			closeButton: false,
			className: 'maplibre-popup-transparent'
		};

		if (anchor !== undefined) popupOptions.anchor = anchor;

		// Create popup
		const popupInstance = new MapLibreGL.Popup(popupOptions)
			.setMaxWidth('none')
			.setDOMContent(container);
		tooltip = popupInstance;

		// Svelte owns the portal subtree and its teardown.
		const contentInstance = mount(Portal, {
			target: container,
			props: { children: content },
			context: contexts
		});

		// Show on hover
		const handleMouseEnter = () => {
			popupInstance.setLngLat(marker.getLngLat()).addTo(map);
		};

		const handleMouseLeave = () => {
			popupInstance.remove();
		};

		markerElement.addEventListener('mouseenter', handleMouseEnter);
		markerElement.addEventListener('mouseleave', handleMouseLeave);

		return () => {
			markerElement.removeEventListener('mouseenter', handleMouseEnter);
			markerElement.removeEventListener('mouseleave', handleMouseLeave);

			void unmount(contentInstance);

			popupInstance.remove();
			tooltip = null;
		};
	});

	$effect(() => {
		if (!tooltip) return;

		tooltip.setOffset(offset ?? 16);
		tooltip.setMaxWidth(maxWidth ?? 'none');
	});
</script>

{#snippet content()}
	<div
		{@attach motionPolicy.attach}
		class={cn(
			'pointer-events-none rounded-md bg-foreground px-2 py-1 text-xs text-balance text-background shadow-md',
			'motion-hint animate-in fade-in-0',
			className
		)}
	>
		{@render children?.()}
	</div>
{/snippet}

<style>
	:global(.maplibre-popup-transparent .maplibregl-popup-content) {
		background: transparent;
		box-shadow: none;
		padding: 0;
	}

	:global(.maplibre-popup-transparent .maplibregl-popup-tip) {
		display: none;
	}
</style>
