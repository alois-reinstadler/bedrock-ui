<script lang="ts">
	import { LayoutGroup, layout, motionPresets } from '#lib/bedrock/motion/index.js';
	import Scene from './scene.svelte';

	const aligns = ['start', 'center', 'end'] as const;
	let align = $state<(typeof aligns)[number]>('start');
	const layoutTransition = motionPresets.layout;
	const chip = layout({ type: 'position', transition: layoutTransition });
</script>

<Scene
	index="03"
	title="Unanimatable CSS"
	hint="justify-content cannot tween. The boxes still travel."
>
	<div class="flex gap-2" role="group" aria-label="Align callsigns">
		{#each aligns as item (item)}
			<button
				type="button"
				class={[
					'rounded-full px-3 py-1.5 text-xs font-medium capitalize',
					align === item ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
				]}
				aria-pressed={align === item}
				onclick={() => (align = item)}
			>
				{item}
			</button>
		{/each}
	</div>
	<LayoutGroup
		class={[
			'flex min-h-28 rounded-[1.75rem] bg-muted/50 p-3',
			align === 'start' && 'justify-start',
			align === 'center' && 'justify-center',
			align === 'end' && 'justify-end'
		]}
	>
		{#each ['Alpha', 'Bravo', 'Charlie'] as callsign (callsign)}
			<div
				{@attach chip}
				class="rounded-2xl bg-background px-5 py-3 text-sm font-medium shadow-[0_18px_40px_-24px_rgba(24,24,27,0.45)]"
			>
				{callsign}
			</div>
		{/each}
	</LayoutGroup>
</Scene>

<style>
</style>
