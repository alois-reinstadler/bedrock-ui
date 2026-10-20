<script lang="ts">
	import { LayoutGroup, layout, motionPresets } from '#lib/bedrock/motion/index.js';
	import Scene from './scene.svelte';
	import { stations } from './stations';
	let expanded = $state<string | null>('kef');
	const layoutTransition = motionPresets.layout;
	const tile = layout({ transition: layoutTransition });
</script>

<Scene index="04" title="Size" hint="The box scales. Type counter-scales so it does not squash.">
	<LayoutGroup class="grid grid-cols-2 gap-2 md:grid-cols-4">
		{#each stations.slice(0, 4) as station (station.id)}
			<button
				type="button"
				{@attach tile}
				class={[
					'overflow-hidden rounded-[1.6rem] text-left',
					expanded === station.id
						? 'col-span-2 min-h-48 bg-foreground text-background md:row-span-2'
						: 'min-h-28 bg-muted'
				]}
				aria-pressed={expanded === station.id}
				onclick={() => (expanded = expanded === station.id ? null : station.id)}
			>
				<span data-layout-invert class="flex h-full flex-col justify-between p-4">
					<span class="font-mono text-[0.7rem] tracking-widest uppercase">{station.code}</span>
					<span class="text-lg tracking-tight">{station.name}</span>
				</span>
			</button>
		{/each}
	</LayoutGroup>
</Scene>

<style>
</style>
