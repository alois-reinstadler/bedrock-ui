<script lang="ts">
	import { onMount, type ComponentProps, type Snippet } from 'svelte';
	import type Map from './Map.svelte';
	import type { Map as MapInstance } from 'maplibre-gl';
	import { cn } from '#lib/bedrock/utils.js';

	type MapComponents = typeof import('./index');
	type Props = Omit<ComponentProps<typeof Map>, 'children' | 'map'> & {
		/** Receives the deferred component family. Import marker/popup components here through this argument. */
		children?: Snippet<[MapComponents]>;
		placeholder?: Snippet;
		/** Load shortly before entering the viewport. */
		rootMargin?: string;
		/** Require a click on Load map instead of loading when visible. */
		activation?: 'visible' | 'interaction';
		map?: MapInstance | null;
	};
	let {
		children,
		placeholder,
		rootMargin = '200px',
		activation = 'visible',
		class: className,
		map = $bindable(null),
		...mapProps
	}: Props = $props();
	let host: HTMLDivElement;
	let components = $state.raw<MapComponents | null>(null);
	let loading = $state(false);
	let failed = $state(false);
	let disposed = false;

	async function load() {
		if (loading || components) return;
		loading = true;
		failed = false;
		try {
			const loaded = await import('./index');
			if (!disposed) components = loaded;
		} catch {
			if (!disposed) failed = true;
		} finally {
			if (!disposed) loading = false;
		}
	}

	onMount(() => {
		let observer: IntersectionObserver | undefined;
		if (activation === 'visible') {
			if ('IntersectionObserver' in window) {
				observer = new IntersectionObserver(
					(entries) => {
						if (entries.some((entry) => entry.isIntersecting)) {
							observer?.disconnect();
							void load();
						}
					},
					{ rootMargin }
				);
				observer.observe(host);
			} else void load();
		}
		return () => {
			disposed = true;
			observer?.disconnect();
		};
	});
</script>

<div bind:this={host} data-slot="lazy-map" class={cn('relative h-full w-full', className)}>
	{#if components}
		<components.Map {...mapProps} bind:map>
			{@render children?.(components)}
		</components.Map>
	{:else}
		<div class="grid h-full place-items-center rounded-[inherit] bg-muted/30 p-6 text-center">
			<div class="space-y-3">
				{#if failed}
					<p role="status" class="text-sm text-muted-foreground">The map could not be loaded.</p>
				{:else if placeholder}
					{@render placeholder()}
				{:else}
					<p role="status" class="text-sm text-muted-foreground">
						{loading ? 'Loading map…' : 'Interactive map'}
					</p>
				{/if}
				{#if failed || activation === 'interaction'}
					<button
						type="button"
						onclick={load}
						disabled={loading}
						class="rounded-md border bg-background px-3 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
						>{failed ? 'Retry map' : 'Load map'}</button
					>
				{/if}
			</div>
		</div>
	{/if}
</div>
