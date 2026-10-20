<script lang="ts">
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';
	import { LayoutGroup, layout, motionPresets } from '#lib/bedrock/motion/index.js';

	let sortable = $state(['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo']);
	const reorderItem = layout({ type: 'position', transition: motionPresets.layout });
	function moveItem(index: number, delta: -1 | 1) {
		const target = index + delta;
		if (target < 0 || target >= sortable.length) return;
		const next = [...sortable];
		[next[index], next[target]] = [next[target]!, next[index]!];
		sortable = next;
	}
</script>

<Benchmark
	id="sortable-layout"
	title="Sortierbare Liste mit überlappender Bewegung"
	summary="Tastaturtaugliche Reorder-Aktionen verschieben reale Listenknoten mit der bestehenden Layout-Engine."
	hardCase="Ein Element schnell zweimal verschieben, während alle anderen noch unterwegs sind. Kein Element darf vom alten Rechteck neu starten."
	verdict="bestanden"
	metadata={{
		role: 'Layout-Bewegung',
		duration: 'motionPresets.layout · 500 ms',
		easing: 'layout spring 117/18.4/1',
		distance: 'durch Reorder-Geometrie',
		properties: 'transform',
		layout: 'Einmalige Messung',
		loop: 'Nein',
		reduced: 'Reihenfolge ändert sich sofort; Buttons und Live-Reihenfolge bleiben zugänglich.'
	}}
>
	<LayoutGroup class="sortable-list">
		{#each sortable as item, index (item)}
			<div {@attach reorderItem}>
				<span>{index + 1}. {item}</span>
				<div>
					<button
						type="button"
						aria-label={`${item} nach oben`}
						disabled={index === 0}
						onclick={() => moveItem(index, -1)}>↑</button
					><button
						type="button"
						aria-label={`${item} nach unten`}
						disabled={index === sortable.length - 1}
						onclick={() => moveItem(index, 1)}>↓</button
					>
				</div>
			</div>
		{/each}
	</LayoutGroup>
</Benchmark>

<style>
	:global(.sortable-list) {
		display: grid;
		gap: 0.35rem;
	}
	:global(.sortable-list > div) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 0.7rem;
		background: var(--background);
		padding: 0.55rem 0.7rem;
		font-size: 0.72rem;
	}
	:global(.sortable-list button) {
		width: 1.8rem;
		height: 1.8rem;
		border-radius: 0.45rem;
		background: var(--muted);
	}
	:global(.sortable-list button:disabled) {
		opacity: 0.25;
	}
</style>
