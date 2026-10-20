<script lang="ts">
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';

	let { run = $bindable() }: { run: number } = $props();
	const distances = [
		['Kontext', 2],
		['Anker', 8],
		['Fläche', 24],
		['Drawer', 80]
	] as const;
</script>

<Benchmark
	id="distance-comparison"
	title="Distanz und visuelles Gewicht"
	summary="Vier Flächen verwenden dieselbe Eintrittskurve, aber Distanzen von einer Mikroverschiebung bis zur großen Fläche."
	hardCase="Große Distanz mit kurzer Dauer vergleichen. Wenn die Fläche fliegt, fehlt ein semantischer Distanz- oder Gewichtstoken."
	verdict="problem"
	finding="Bedrock besitzt keine gemeinsamen Distanz-Tokens. Die Werte im Lab sind Diagnosewerte, keine neue Systemvorgabe."
	metadata={{
		role: 'Eintritt',
		duration: 'motionPresets.enter · 230 ms',
		easing: 'motionEasings.enter',
		distance: '2 / 8 / 24 / 80 px (Lab-Probe)',
		properties: 'transform, opacity',
		layout: 'Nein',
		loop: 'Nein',
		reduced: 'Translation entfällt; 80 ms Opacity bleibt als Zustandsbestätigung.'
	}}
>
	{#key run}
		<div class="distance-grid">
			{#each distances as [label, distance] (label)}
				<div>
					<span>{label} · {distance}px</span><i
						class="distance-card lab-animated lab-spatial"
						style:--distance={`${distance}px`}
					></i>
				</div>
			{/each}
		</div>
	{/key}
</Benchmark>

<style>
	.distance-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.65rem;
	}
	.distance-grid > div {
		display: grid;
		min-height: 8rem;
		place-items: center;
		overflow: hidden;
		border-radius: 0.9rem;
		background: var(--background);
		padding: 0.75rem;
	}
	.distance-grid span {
		color: var(--muted-foreground);
		font-size: 0.66rem;
	}
	.distance-card {
		display: block;
		width: 70%;
		height: 2.8rem;
		border: 1px solid var(--border);
		border-radius: 0.7rem;
		background: var(--card);
		box-shadow: 0 14px 25px -20px rgb(0 0 0 / 0.5);
	}
	.distance-card {
		animation: distance-enter var(--motion-enter) var(--ease-enter) both;
	}

	@keyframes distance-enter {
		from {
			transform: translateY(var(--distance));
			opacity: 0;
		}
	}

	@media (max-width: 48rem) {
		.distance-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
