<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';

	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';

	import { Button } from '#lib/bedrock/ui/button';
	import { Checkbox } from '#lib/bedrock/ui/checkbox';

	let instantMotion = $state(false);
	let denseSelection = new SvelteSet<number>();
	let search = $state('mo');
	let numericValue = $state(1482);
	const searchResults = $derived(
		['Motion Lab', 'Motion Tokens', 'Motion Policy', 'Layout Motion', 'Reduced Motion'].filter(
			(item) => item.toLowerCase().includes(search.toLowerCase())
		)
	);
	function toggleDense(index: number) {
		if (denseSelection.has(index)) denseSelection.delete(index);
		else denseSelection.add(index);
	}
</script>

<Benchmark
	id="should-this-animate"
	title="Soll das überhaupt animieren?"
	summary="Dichte, hochfrequente Zustände werden standardmäßig instant gezeigt. Ein Schalter aktiviert absichtlich unnötige Motion zum direkten Vergleich."
	hardCase="Tastaturmenü halten, Suchbegriff bei jedem Keystroke ändern, 12 Tabellenzeilen auswählen und Zahlen zehnmal pro Sekunde aktualisieren."
	verdict="kein-motion"
	finding="Keine Animation ist hier die richtige Motion-Entscheidung. Fokus, Farbe und Struktur liefern bereits ausreichendes Feedback ohne visuelle Latenz."
	metadata={{
		role: 'Press / unmittelbares Feedback',
		duration: '0 ms empfohlen',
		easing: 'nicht relevant',
		distance: '0',
		properties: 'Farbe/Fokus instant',
		layout: 'Nein',
		loop: 'Nein',
		reduced: 'Identisch zum Normalmodus.'
	}}
>
	{#snippet actions()}<label class="motion-toggle"
			><Checkbox bind:checked={instantMotion} /> unnötige Motion zeigen</label
		>{/snippet}
	<div class={['frequency-grid', { 'unnecessary-motion': instantMotion }]}>
		<div class="search-probe">
			<label>Autocomplete<input bind:value={search} /></label>
			<div>
				{#each searchResults as result (result)}<button type="button">{result}</button>{/each}
			</div>
		</div>
		<div class="dense-table">
			{#each Array.from(Array(12).keys()) as index (index)}<button
					type="button"
					aria-pressed={denseSelection.has(index)}
					onclick={() => toggleDense(index)}
					>Zeile {index + 1}<span>{denseSelection.has(index) ? 'ausgewählt' : '—'}</span></button
				>{/each}
		</div>
		<div class="number-probe">
			<span>Live-Wert</span><strong>{new Intl.NumberFormat('de-AT').format(numericValue)}</strong
			><Button
				size="sm"
				variant="outline"
				onclick={() => {
					for (let i = 1; i <= 10; i += 1) window.setTimeout(() => (numericValue += 7), i * 60);
				}}>10 Updates</Button
			>
		</div>
	</div>
</Benchmark>

<style>
	.search-probe input {
		height: 2.2rem;
		border: 1px solid var(--border);
		border-radius: 0.6rem;
		background: var(--card);
		padding: 0 0.65rem;
		font-size: 0.75rem;
		outline: none;
	}
	.search-probe input:focus {
		border-color: var(--ring);
		box-shadow: 0 0 0 2px color-mix(in oklab, var(--ring), transparent 75%);
	}

	.motion-toggle {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.7rem;
	}
	.frequency-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 0.7fr;
		gap: 0.6rem;
	}
	.frequency-grid > div {
		border-radius: 0.8rem;
		background: var(--background);
		padding: 0.7rem;
	}
	.search-probe label,
	.search-probe label input {
		display: block;
		width: 100%;
	}
	.search-probe label {
		color: var(--muted-foreground);
		font-size: 0.65rem;
	}
	.search-probe input {
		margin-top: 0.3rem;
	}
	.search-probe > div {
		display: grid;
		margin-top: 0.4rem;
	}
	.search-probe button,
	.dense-table button {
		display: flex;
		width: 100%;
		justify-content: space-between;
		border-radius: 0.4rem;
		padding: 0.35rem;
		text-align: left;
		font-size: 0.68rem;
	}
	.search-probe button:focus,
	.dense-table button:focus,
	.dense-table button[aria-pressed='true'] {
		background: var(--foreground);
		color: var(--background);
	}
	.dense-table span {
		color: var(--muted-foreground);
	}
	.dense-table button[aria-pressed='true'] span {
		color: inherit;
	}
	.number-probe {
		display: grid;
		align-content: center;
		gap: 0.5rem;
	}
	.number-probe span {
		color: var(--muted-foreground);
		font-size: 0.65rem;
	}
	.number-probe strong {
		font-variant-numeric: tabular-nums;
		font-size: 1.4rem;
	}
	.unnecessary-motion :is(button, strong, .search-probe > div) {
		transition: all 400ms ease;
	}
	.unnecessary-motion .dense-table button[aria-pressed='true'] {
		transform: translateX(6px);
	}
	@media (max-width: 52rem) {
		.frequency-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
