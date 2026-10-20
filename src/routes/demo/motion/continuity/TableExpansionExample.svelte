<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';

	import { Button } from '#lib/bedrock/ui/button';

	let tableRows = new SvelteSet<number>();
	function toggleRows(all = false) {
		if (all) {
			if (tableRows.size === 20) tableRows.clear();
			else for (const index of Array.from(Array(20).keys())) tableRows.add(index);
			return;
		}
		const wasOpen = tableRows.has(0);
		tableRows.clear();
		if (!wasOpen) tableRows.add(0);
	}
</script>

<Benchmark
	id="table-expansion"
	title="20 Tabellenzeilen gleichzeitig aufklappen"
	summary="Eine dichte, tabellenartige Liste provoziert den teuersten Disclosure-Fall und macht Scrollbewegung sichtbar."
	hardCase="Alle 20 öffnen, sofort schließen und währenddessen Zeile 1 wieder öffnen. Layoutarbeit darf keine veralteten Panels zurücklassen."
	verdict="problem"
	finding="20 echte Höhenanimationen erzwingen Layout pro Frame. Für dichte Tabellen sind instant Expansion, ein einzelnes Detailpanel oder Virtualisierung meist sinnvoller."
	metadata={{
		role: 'Layout-Bewegung',
		duration: 'motionPresets.reveal × 20',
		easing: 'motionEasings.enter / exit',
		distance: '20 × 44 px Detailhöhe',
		properties: 'height, opacity, padding',
		layout: 'Pro Frame',
		loop: 'Nein',
		reduced: 'Sofortige Layoutänderung; Fokus und Zeilenbezug bleiben erhalten.'
	}}
>
	{#snippet actions()}<Button size="sm" onclick={() => toggleRows(true)}
			>{tableRows.size === 20 ? 'Alle schließen' : '20 öffnen'}</Button
		>{/snippet}
	<div class="data-table">
		{#each Array.from(Array(20).keys()) as index (index)}
			<div class="data-row">
				<button
					type="button"
					aria-expanded={tableRows.has(index)}
					onclick={() => {
						if (tableRows.has(index)) tableRows.delete(index);
						else tableRows.add(index);
					}}
					><span>Datensatz {String(index + 1).padStart(2, '0')}</span><strong
						>{tableRows.has(index) ? '−' : '+'}</strong
					></button
				>
				{#if tableRows.has(index)}<div class="row-detail lab-animated">
						Detailinhalt für Datensatz {index + 1}; Höhe und Reflow unter Last prüfen.
					</div>{/if}
			</div>
		{/each}
	</div>
</Benchmark>

<style>
	.data-table {
		max-height: 25rem;
		overflow: auto;
		border: 1px solid var(--border);
		border-radius: 0.8rem;
		background: var(--background);
	}
	.data-row + .data-row {
		border-top: 1px solid var(--border);
	}
	.data-row button {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		padding: 0.55rem 0.7rem;
		font-size: 0.7rem;
	}
	.row-detail {
		background: var(--muted);
		padding: 0.65rem 0.7rem;
		color: var(--muted-foreground);
		font-size: 0.68rem;
		animation: detail-in var(--motion-reveal) var(--ease-enter) both;
	}

	@keyframes detail-in {
		from {
			opacity: 0;
			clip-path: inset(50% 0);
		}
	}
</style>
