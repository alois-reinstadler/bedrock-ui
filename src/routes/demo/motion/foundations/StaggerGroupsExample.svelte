<script lang="ts">
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';

	let groupSize = $state<3 | 10 | 50>(10);
	let showGroup = $state(true);
</script>

<Benchmark
	id="stagger-groups"
	title="Staffelung unter Gruppendruck"
	summary="3, 10 oder 50 Elemente starten mit demselben 22-ms-Versatz. Der Test zeigt, wann die Gruppe zur Warteschlange wird."
	hardCase="Elternfläche schließen, während 50 Kinder noch eintreten. Kein verzögertes Kind darf später wieder sichtbar werden."
	verdict={groupSize === 50 ? 'problem' : 'beobachten'}
	finding="Eine feste Staffelung skaliert nicht: Bei 50 Elementen beginnt das letzte erst nach mehr als einer Sekunde. Für dichte Ergebnisse sollte sie entfallen oder gedeckelt werden."
	metadata={{
		role: 'Gruppe / Staffelung',
		duration: 'motionPresets.enter · 230 ms',
		easing: 'motionEasings.enter',
		delay: 'index × 22 ms (Lab-Probe)',
		distance: '8 px',
		properties: 'transform, opacity',
		layout: 'Nein',
		loop: 'Nein',
		reduced: 'Keine Staffelung; Inhalte erscheinen gemeinsam mit kurzer Opacity.'
	}}
>
	{#snippet actions()}
		<button type="button" onclick={() => (showGroup = !showGroup)}
			>{showGroup ? 'Gruppe schließen' : 'Gruppe öffnen'}</button
		>
	{/snippet}
	<div class="group-controls" role="group" aria-label="Gruppengröße">
		{#each [3, 10, 50] as size (size)}
			<button
				type="button"
				aria-pressed={groupSize === size}
				onclick={() => {
					groupSize = size as typeof groupSize;
					showGroup = true;
				}}>{size} Elemente</button
			>
		{/each}
	</div>
	{#if showGroup}
		<div class="stagger-grid">
			{#each Array.from(Array(groupSize).keys()) as index (index)}
				<i class="stagger-item lab-animated lab-spatial" style:--index={index}>{index + 1}</i>
			{/each}
		</div>
	{:else}
		<p class="empty">Gruppe geschlossen. Es dürfen keine verzögerten Eintritte nachlaufen.</p>
	{/if}
</Benchmark>

<style>
	.group-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin-bottom: 0.8rem;
	}
	.group-controls button {
		border-radius: 999px;
		background: var(--background);
		padding: 0.4rem 0.7rem;
		color: var(--muted-foreground);
		font-size: 0.7rem;
	}
	.group-controls button[aria-pressed='true'] {
		background: var(--foreground);
		color: var(--background);
	}
	.stagger-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(2.2rem, 1fr));
		gap: 0.35rem;
	}
	.stagger-item {
		display: grid;
		min-height: 2.2rem;
		place-items: center;
		border-radius: 0.55rem;
		background: var(--background);
		color: var(--muted-foreground);
		font-size: 0.65rem;
		font-style: normal;
		animation: stagger-enter var(--motion-enter) var(--ease-enter) both;
		animation-delay: calc(var(--index) * 22ms * var(--lab-time-scale));
	}
	.empty {
		color: var(--muted-foreground);
		font-size: 0.75rem;
	}

	@keyframes stagger-enter {
		from {
			transform: translateY(8px);
			opacity: 0;
		}
	}
</style>
