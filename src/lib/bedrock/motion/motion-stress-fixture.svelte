<script lang="ts">
	import LayoutGroup from './layout-group.svelte';
	import { layout } from './layout.svelte.js';

	const stressTransition = {
		duration: 140,
		spring: { stiffness: 117, damping: 18.4, mass: 1 }
	};
	const stressItem = layout({ type: 'position', transition: stressTransition });
	const scaleItem = layout({ type: 'both', transition: stressTransition });

	let count = $state<50 | 100>(50);
	let shifted = $state(false);
	let expanded = $state(false);
	let items = $derived(Array.from({ length: count }, (_, id) => id));
</script>

<div class="stress-controls">
	<button type="button" onclick={() => (count = 50)}>50 Knoten</button>
	<button type="button" onclick={() => (count = 100)}>100 Knoten</button>
	<button type="button" onclick={() => (shifted = !shifted)}>Raster umschalten</button>
</div>

<LayoutGroup
	class={`stress-root ${shifted ? 'is-shifted' : ''}`}
	data-motion-stress-root
	data-testid="stress-root"
	data-count={count}
>
	{#each items as id (id)}
		<div
			{@attach stressItem}
			class="stress-item"
			style={`--from-x: ${(id % 10) * 56}px; --to-x: ${(9 - (id % 10)) * 56}px; --y: ${Math.floor(id / 10) * 28}px;`}
		>
			{id + 1}
		</div>
	{/each}
</LayoutGroup>

<button type="button" onclick={() => (expanded = !expanded)}>Größe umschalten</button>
<LayoutGroup
	class={`scale-probe ${expanded ? 'is-expanded' : ''}`}
	data-motion-scale-root
	data-testid="scale-probe"
>
	<div {@attach scaleItem} class="scale-item"></div>
	<div {@attach scaleItem} class="scale-item"></div>
</LayoutGroup>

<style>
	.stress-controls {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	button {
		padding: 0.25rem 0.5rem;
		border: 1px solid currentColor;
	}

	:global(.stress-root) {
		position: relative;
		width: 552px;
		height: 272px;
		contain: layout style;
	}

	.stress-item {
		position: absolute;
		top: var(--y);
		left: var(--from-x);
		display: grid;
		width: 48px;
		height: 20px;
		place-items: center;
		background: rgb(30 30 30);
		font-size: 10px;
		color: white;
	}

	:global(.is-shifted) .stress-item {
		left: var(--to-x);
	}

	:global(.scale-probe) {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		height: 96px;
		margin-top: 0.75rem;
	}

	.scale-item {
		width: 48px;
		height: 36px;
		border-radius: 12px;
		background: rgb(60 90 180);
	}

	:global(.scale-probe.is-expanded) .scale-item {
		width: 80px;
		height: 64px;
	}
</style>
