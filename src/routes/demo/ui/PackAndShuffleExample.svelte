<script lang="ts">
	import { appear, vanish } from '#lib/bedrock/motion/index.js';
	import ShuffleIcon from '@lucide/svelte/icons/shuffle';

	import { LayoutGroup, layout, motionEasings, motionPresets } from '#lib/bedrock/motion/index.js';
	import Scene from './scene.svelte';
	import { stations, type Station } from './stations';
	const regions = ['all', 'west', 'north', 'island'] as const;
	let region = $state<(typeof regions)[number]>('all');
	let deck = $state<Station[]>([...stations]);
	const visible = $derived(
		region === 'all' ? deck : deck.filter((station) => station.region === region)
	);
	const layoutTransition = motionPresets.layout;
	const pack = layout({ type: 'position', transition: layoutTransition });
	function shuffle() {
		const next = [...deck];
		for (let i = next.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const current = next[i];
			const swap = next[j];
			if (!current || !swap) continue;
			next[i] = swap;
			next[j] = current;
		}
		deck = next;
	}
</script>

<Scene
	index="02"
	title="Pack and shuffle"
	hint="Filter and reorder. Remaining cards keep their ink."
>
	<div class="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by region">
		{#each regions as item (item)}
			<button
				type="button"
				class={[
					'rounded-full px-3 py-1.5 text-xs font-medium capitalize',
					region === item ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
				]}
				aria-pressed={region === item}
				onclick={() => (region = item)}
			>
				{item}
			</button>
		{/each}
		<button
			type="button"
			class="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium"
			onclick={shuffle}
		>
			<ShuffleIcon class="size-3.5" />
			Shuffle
		</button>
	</div>
	<LayoutGroup class="relative grid grid-cols-2 gap-2 sm:grid-cols-3">
		{#each visible as station (station.id)}
			<article
				{@attach pack}
				class="rounded-2xl bg-muted/80 px-4 py-5"
				in:appear={{
					delay: motionPresets.exit.duration,
					duration: motionPresets.enter.duration,
					easing: motionEasings.enter,
					start: 0.98
				}}
				out:vanish={{
					duration: motionPresets.exit.duration,
					easing: motionEasings.exit,
					end: 0.98
				}}
			>
				<p class="font-mono text-[0.7rem] tracking-widest uppercase">{station.code}</p>
				<p class="mt-2 text-lg tracking-tight">{station.name}</p>
				<p class="mt-1 text-xs text-muted-foreground capitalize">{station.region}</p>
			</article>
		{/each}
	</LayoutGroup>
</Scene>

<style>
</style>
