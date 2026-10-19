<script lang="ts">
	import { getMapContext } from './use-map.svelte.js';
	import { cn } from '#lib/bedrock/utils.js';
	import Plus from '@lucide/svelte/icons/plus';
	import Minus from '@lucide/svelte/icons/minus';
	import Locate from '@lucide/svelte/icons/locate';
	import Maximize from '@lucide/svelte/icons/maximize';
	import Loader2 from '@lucide/svelte/icons/loader-2';

	interface Props {
		position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
		showZoom?: boolean;
		showCompass?: boolean;
		showLocate?: boolean;
		showFullscreen?: boolean;
		class?: string;
		onlocate?: (coords: { longitude: number; latitude: number }) => void;
	}

	let {
		position = 'bottom-right',
		showZoom = true,
		showCompass = false,
		showLocate = false,
		showFullscreen = false,
		class: className,
		onlocate
	}: Props = $props();

	const mapCtx = getMapContext();

	let waitingForLocation = $state(false);
	let compassElement: SVGSVGElement | null = $state(null);
	const loaded = $derived(mapCtx.isLoaded());

	const positionClasses = {
		'top-left': 'top-2 left-2',
		'top-right': 'top-2 right-2',
		'bottom-left': 'bottom-2 left-2',
		'bottom-right': 'bottom-10 right-2'
	};

	// Update compass rotation
	$effect(() => {
		const map = mapCtx.getMap();

		if (!loaded || !map || !compassElement) return;

		const updateRotation = () => {
			if (!compassElement) return;
			const bearing = map.getBearing();
			const pitch = map.getPitch();
			compassElement.style.transform = `rotateX(${pitch}deg) rotateZ(${-bearing}deg)`;
		};

		map.on('rotate', updateRotation);
		map.on('pitch', updateRotation);
		updateRotation();

		return () => {
			map.off('rotate', updateRotation);
			map.off('pitch', updateRotation);
		};
	});

	function handleZoomIn() {
		const map = mapCtx.getMap();
		if (map) mapCtx.moveCamera({ zoom: map.getZoom() + 1, duration: 300 });
	}

	function handleZoomOut() {
		const map = mapCtx.getMap();
		if (map) mapCtx.moveCamera({ zoom: map.getZoom() - 1, duration: 300 });
	}

	function handleResetBearing() {
		const map = mapCtx.getMap();
		if (map) mapCtx.moveCamera({ bearing: 0, pitch: 0, duration: 300 });
	}

	function handleLocate() {
		const map = mapCtx.getMap();
		if (!map) return;
		if (!('geolocation' in navigator)) return;

		waitingForLocation = true;

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const coords = {
					longitude: position.coords.longitude,
					latitude: position.coords.latitude
				};
				mapCtx.moveCamera(
					{
						center: [coords.longitude, coords.latitude],
						zoom: 14,
						duration: 1500
					},
					true
				);
				onlocate?.(coords);
				waitingForLocation = false;
			},
			(error) => {
				console.error('Error getting location:', error);
				waitingForLocation = false;
			},
			{ timeout: 10000 }
		);
	}

	function handleFullscreen() {
		const map = mapCtx.getMap();
		const container = map?.getContainer();
		if (!container) return;

		if (document.fullscreenElement) {
			document.exitFullscreen();
		} else {
			container.requestFullscreen();
		}
	}
</script>

{#if loaded}
	<div class={cn('absolute z-10 flex flex-col gap-1.5', positionClasses[position], className)}>
		{#if showZoom}
			<div
				class="flex flex-col overflow-hidden rounded-md border border-border bg-background shadow-sm [&>button:not(:last-child)]:border-b [&>button:not(:last-child)]:border-border"
			>
				<button
					onclick={handleZoomIn}
					aria-label="Zoom in"
					type="button"
					class="flex size-8 items-center justify-center transition-colors first:rounded-t-md last:rounded-b-md hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-accent/40"
				>
					<Plus class="size-4" />
				</button>
				<button
					onclick={handleZoomOut}
					aria-label="Zoom out"
					type="button"
					class="flex size-8 items-center justify-center transition-colors first:rounded-t-md last:rounded-b-md hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-accent/40"
				>
					<Minus class="size-4" />
				</button>
			</div>
		{/if}

		{#if showCompass}
			<div
				class="flex flex-col overflow-hidden rounded-md border border-border bg-background shadow-sm"
			>
				<button
					onclick={handleResetBearing}
					aria-label="Reset bearing to north"
					type="button"
					class="flex size-8 items-center justify-center transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-accent/40"
				>
					<svg
						bind:this={compassElement}
						viewBox="0 0 24 24"
						class="size-5"
						style="transform-style: preserve-3d;"
					>
						<path d="M12 2L16 12H12V2Z" class="fill-red-500" />
						<path d="M12 2L8 12H12V2Z" class="fill-red-300" />
						<path d="M12 22L16 12H12V22Z" class="fill-muted-foreground/60" />
						<path d="M12 22L8 12H12V22Z" class="fill-muted-foreground/30" />
					</svg>
				</button>
			</div>
		{/if}

		{#if showLocate}
			<div
				class="flex flex-col overflow-hidden rounded-md border border-border bg-background shadow-sm"
			>
				<button
					onclick={handleLocate}
					aria-label="Find my location"
					type="button"
					class="flex size-8 items-center justify-center transition-colors first:rounded-t-md last:rounded-b-md hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-accent/40"
					disabled={waitingForLocation}
				>
					{#if waitingForLocation}
						<Loader2 class="size-4 animate-spin" />
					{:else}
						<Locate class="size-4" />
					{/if}
				</button>
			</div>
		{/if}

		{#if showFullscreen}
			<div
				class="flex flex-col overflow-hidden rounded-md border border-border bg-background shadow-sm"
			>
				<button
					onclick={handleFullscreen}
					aria-label="Toggle fullscreen"
					type="button"
					class="flex size-8 items-center justify-center transition-colors first:rounded-t-md last:rounded-b-md hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset disabled:pointer-events-none disabled:opacity-50 dark:hover:bg-accent/40"
				>
					<Maximize class="size-4" />
				</button>
			</div>
		{/if}
	</div>
{/if}
