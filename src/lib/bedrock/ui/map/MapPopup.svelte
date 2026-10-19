<script lang="ts">
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	const motionPolicy = useMotionPolicy();
	import { getMapContext } from './use-map.svelte.js';
	import { getContext, getAllContexts, mount, unmount } from 'svelte';
	import Portal from './Portal.svelte';
	const contexts = getAllContexts();
	import * as MapLibreGL from 'maplibre-gl';
	import type { PopupOptions } from 'maplibre-gl';
	import { cn } from '#lib/bedrock/utils.js';
	import X from '@lucide/svelte/icons/x';

	interface Props {
		longitude: number;
		latitude: number;
		children?: import('svelte').Snippet;
		class?: string;
		closeButton?: boolean;
		onclose?: () => void;
		offset?: PopupOptions['offset'];
		anchor?: PopupOptions['anchor'];
		closeOnClick?: boolean;
		closeOnMove?: boolean;
		focusAfterOpen?: boolean;
		maxWidth?: string;
	}

	let {
		longitude,
		latitude,
		children,
		class: className,
		closeButton = false,
		onclose,
		offset = 16,
		anchor,
		closeOnClick,
		closeOnMove,
		focusAfterOpen,
		maxWidth
	}: Props = $props();

	const mapCtx = getMapContext();

	const markerCtx =
		getContext<{
			isDraggable?: () => boolean;
		}>('marker') || {};

	let popup: MapLibreGL.Popup | null = null;

	// Create popup when map is ready
	$effect(() => {
		const map = mapCtx.getMap();
		const loaded = mapCtx.isLoaded();

		if (!loaded || !map) return;

		// Validate coordinates
		if (
			typeof longitude !== 'number' ||
			typeof latitude !== 'number' ||
			Number.isNaN(longitude) ||
			Number.isNaN(latitude)
		) {
			return;
		}

		// Create popup container
		const container = document.createElement('div');

		// Build popup options
		const popupOptions: PopupOptions = {
			offset,
			closeButton: false,
			className: 'maplibre-popup-transparent'
		};

		// If marker is draggable, preserve popup state during movement
		if (markerCtx.isDraggable?.()) {
			popupOptions.closeOnMove = false;
		}

		if (anchor !== undefined) popupOptions.anchor = anchor;
		if (closeOnClick !== undefined) popupOptions.closeOnClick = closeOnClick;
		if (closeOnMove !== undefined) popupOptions.closeOnMove = closeOnMove;
		if (focusAfterOpen !== undefined) popupOptions.focusAfterOpen = focusAfterOpen;

		// Create popup
		const popupInstance = new MapLibreGL.Popup(popupOptions)
			.setDOMContent(container)
			.setLngLat([longitude, latitude])
			.addTo(map);

		if (maxWidth) {
			popupInstance.setMaxWidth(maxWidth);
		} else {
			popupInstance.setMaxWidth('none');
		}

		popup = popupInstance;

		// Handle close event
		const handleClose = () => onclose?.();
		popupInstance.on('close', handleClose);

		// Svelte owns the portal subtree and its teardown.
		const contentInstance = mount(Portal, {
			target: container,
			props: { children: content },
			context: contexts
		});

		return () => {
			popupInstance.off('close', handleClose);

			void unmount(contentInstance);

			if (popupInstance.isOpen()) {
				popupInstance.remove();
			}
			popup = null;
		};
	});

	// Update position when coordinates change
	$effect(() => {
		if (!popup) return;
		if (
			typeof longitude !== 'number' ||
			typeof latitude !== 'number' ||
			Number.isNaN(longitude) ||
			Number.isNaN(latitude)
		) {
			return;
		}

		const current = popup.getLngLat();
		if (!current || current.lng !== longitude || current.lat !== latitude) {
			popup.setLngLat([longitude, latitude]);
		}
		popup.setOffset(offset ?? 16);
		popup.setMaxWidth(maxWidth ?? 'none');
	});

	function handleClose() {
		popup?.remove();
	}
</script>

{#snippet content()}
	<div
		{@attach motionPolicy.attach}
		class={cn(
			'relative max-w-62 rounded-md border bg-popover p-3 text-popover-foreground shadow-md',
			'motion-popover animate-in fade-in-0',
			className
		)}
	>
		{#if closeButton}
			<button
				type="button"
				onclick={handleClose}
				aria-label="Close popup"
				class="absolute top-1 right-1 z-10 inline-flex size-5 cursor-pointer items-center justify-center rounded-sm text-foreground transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
			>
				<X class="size-3.5" />
			</button>
		{/if}
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
