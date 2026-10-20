<script lang="ts">
	import { appear } from '#lib/bedrock/motion/index.js';
	import { tick } from 'svelte';
	import type { Attachment } from 'svelte/attachments';

	import { LayoutGroup, layout, motionEasings, motionPresets } from '#lib/bedrock/motion/index.js';
	import Scene from './scene.svelte';
	import { stations } from './stations';
	let featured = $state<string | null>(null);
	const featuredStation = $derived(stations.find((station) => station.id === featured) ?? null);
	const layoutTransition = motionPresets.layout;
	// Attachment caching is not render state.
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	const sharedLayouts = new Map<string, Attachment<HTMLElement>>();
	function shared(id: string, type: 'both' | 'position' = 'both') {
		const cacheKey = `${type}:${id}`;
		let attachment = sharedLayouts.get(cacheKey);
		if (!attachment) {
			const created = layout({ id, type, transition: layoutTransition });
			sharedLayouts.set(cacheKey, created);
			attachment = created;
		}
		return attachment;
	}
	async function showFeatured(id: string) {
		featured = id;
		await tick();
		document.querySelector<HTMLButtonElement>('#motion-feature-stage')?.focus({
			preventScroll: true
		});
	}
	async function closeFeatured() {
		const id = featured;
		featured = null;
		await tick();
		if (!id) return;
		document.querySelector<HTMLButtonElement>(`#motion-feature-card-${id}`)?.focus({
			preventScroll: true
		});
	}
</script>

<Scene
	index="09"
	title="Card to stage"
	hint="Surface and identity text transfer independently. Neighbors keep their seats."
>
	<LayoutGroup class="relative min-h-56">
		<div class="grid grid-cols-3 gap-2" inert={featuredStation !== null}>
			{#each stations.slice(0, 3) as station (station.id)}
				{#if featured !== station.id}
					<button
						id={`motion-feature-card-${station.id}`}
						type="button"
						class="relative min-h-28 rounded-[1.6rem] p-4 text-left"
						onclick={() => showFeatured(station.id)}
					>
						<span
							{@attach shared(station.id)}
							class="absolute inset-0 rounded-[1.6rem] bg-muted"
							aria-hidden="true"
						></span>
						<span class="relative z-10 flex h-full flex-col justify-between">
							<span
								{@attach shared(`station-code-${station.id}`, 'position')}
								class="w-fit font-mono text-[0.7rem] tracking-widest uppercase">{station.code}</span
							>
							<span
								{@attach shared(`station-name-${station.id}`, 'position')}
								class="w-fit text-lg tracking-tight">{station.name}</span
							>
						</span>
					</button>
				{:else}
					<div class="min-h-28 rounded-[1.6rem] bg-muted/40" aria-hidden="true"></div>
				{/if}
			{/each}
		</div>
		{#if featuredStation}
			<button
				id="motion-feature-stage"
				type="button"
				class="absolute inset-0 z-10 flex min-h-56 w-full flex-col justify-between overflow-hidden rounded-[1.6rem] p-4 text-left text-background"
				aria-label={`Close details for ${featuredStation.name}`}
				onclick={closeFeatured}
			>
				<span
					{@attach shared(featuredStation.id)}
					class="absolute inset-0 rounded-[1.6rem] bg-foreground"
					aria-hidden="true"
				></span>
				<span class="relative z-10 flex h-full flex-col justify-between">
					<span
						{@attach shared(`station-code-${featuredStation.id}`, 'position')}
						class="w-fit font-mono text-[0.7rem] tracking-widest uppercase"
						>{featuredStation.code}</span
					>
					<span>
						<span
							{@attach shared(`station-name-${featuredStation.id}`, 'position')}
							class="block w-fit text-lg tracking-tight">{featuredStation.name}</span
						>
						<span
							class="mt-2 block text-sm text-background/70"
							in:appear={{
								delay: motionPresets.state.duration,
								duration: motionPresets.enter.duration,
								easing: motionEasings.enter,
								start: 1
							}}>Click to fold back</span
						>
					</span>
				</span>
			</button>
		{/if}
	</LayoutGroup>
</Scene>

<style>
</style>
