<script lang="ts">
	import { LayoutGroup, layout, motionPresets } from '#lib/bedrock/motion/index.js';
	import Scene from './scene.svelte';
	import { stations } from './stations';
	let selectedRow = $state('tos');
	const selectionTransition = {
		duration: motionPresets.state.duration,
		spring: motionPresets.swap.spring
	};
	const rowMark = layout({ id: 'row-mark', transition: selectionTransition });
</script>

<Scene
	index="08"
	title="Row mark"
	hint="Shared id on the highlight. It remounts under the selected row."
>
	<LayoutGroup class="flex flex-col overflow-hidden rounded-[1.6rem] bg-muted/50">
		{#each stations as station (station.id)}
			<button
				type="button"
				class="relative flex items-center justify-between px-4 py-3 text-left text-sm"
				aria-pressed={selectedRow === station.id}
				onclick={() => (selectedRow = station.id)}
			>
				{#if selectedRow === station.id}
					<span {@attach rowMark} class="absolute inset-0 bg-background" aria-hidden="true"></span>
				{/if}
				<span class="relative font-medium">{station.name}</span>
				<span class="relative font-mono text-[0.7rem] tracking-widest text-muted-foreground"
					>{station.code}</span
				>
			</button>
		{/each}
	</LayoutGroup>
</Scene>

<style>
</style>
