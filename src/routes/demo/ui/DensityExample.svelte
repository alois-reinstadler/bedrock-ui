<script lang="ts">
	import { LayoutGroup, autoSize, layout, motionPresets } from '#lib/bedrock/motion/index.js';
	import Scene from './scene.svelte';
	import { stations } from './stations';
	let dense = $state(false);
	const layoutTransition = motionPresets.layout;
	const densityCard = layout({ type: 'position', transition: layoutTransition });
	const densityShell = autoSize({ duration: motionPresets.layout.duration });
</script>

<Scene
	index="10"
	title="Density"
	hint="Cards keep identity while the grid settles into its new natural height."
>
	<button
		type="button"
		class="w-fit rounded-full bg-muted px-3 py-1.5 text-xs font-medium"
		aria-pressed={dense}
		aria-controls="motion-density-grid"
		onclick={() => (dense = !dense)}
	>
		{dense ? 'Open grid' : 'Dense grid'}
	</button>
	<div id="motion-density-shell" {@attach densityShell} class="overflow-hidden">
		<LayoutGroup
			id="motion-density-grid"
			class={['grid gap-2', dense ? 'grid-cols-3' : 'grid-cols-2']}
		>
			{#each stations as station (station.id)}
				<article {@attach densityCard} class="rounded-2xl bg-muted/80 px-3 py-4">
					<p class="font-mono text-[0.65rem] tracking-widest uppercase">{station.code}</p>
					<p class="mt-1 text-sm tracking-tight">{station.name}</p>
				</article>
			{/each}
		</LayoutGroup>
	</div>
</Scene>

<style>
</style>
