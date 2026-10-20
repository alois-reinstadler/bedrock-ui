<script lang="ts">
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';

	let { run = $bindable() }: { run: number } = $props();
	const origins = [
		['Mitte', '50% 50%'],
		['Trigger oben links', '12% 0%'],
		['Trigger unten', '50% 100%'],
		['Kante rechts', '100% 50%']
	] as const;
</script>

<Benchmark
	id="origin-comparison"
	title="Maßstab und Transform-Ursprung"
	summary="Subtiles scale(0.96) plus Opacity verbindet Kontextflächen mit Trigger oder Kante, ohne den cartoonhaften scale(0)-Effekt."
	hardCase="Ursprung nach einer Collision-Flip-Position wechseln. Öffnen und sofort schließen, bevor der neue Ursprung vollständig sichtbar ist."
	verdict="beobachten"
	metadata={{
		role: 'Eintritt',
		duration: 'motionPresets.enter · 230 ms',
		easing: 'motionEasings.enter',
		distance: 'scale 0.96 → 1',
		origin: 'Mitte / Trigger / Unterkante / rechte Kante',
		properties: 'transform, opacity',
		layout: 'Nein',
		loop: 'Nein',
		reduced: 'Skalierung entfernt, Opacity bleibt.'
	}}
>
	{#key run}
		<div class="origin-grid">
			{#each origins as [label, origin] (label)}
				<div>
					<span>{label}</span><i
						class="origin-card lab-animated lab-spatial"
						style:transform-origin={origin}
					></i>
				</div>
			{/each}
		</div>
	{/key}
</Benchmark>

<style>
	.origin-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.65rem;
	}
	.origin-grid > div {
		display: grid;
		min-height: 8rem;
		place-items: center;
		overflow: hidden;
		border-radius: 0.9rem;
		background: var(--background);
		padding: 0.75rem;
	}
	.origin-grid span {
		color: var(--muted-foreground);
		font-size: 0.66rem;
	}
	.origin-card {
		display: block;
		width: 70%;
		height: 2.8rem;
		border: 1px solid var(--border);
		border-radius: 0.7rem;
		background: var(--card);
		box-shadow: 0 14px 25px -20px rgb(0 0 0 / 0.5);
	}

	.origin-card {
		animation: origin-enter var(--motion-enter) var(--ease-enter) both;
	}

	@keyframes origin-enter {
		from {
			transform: scale(0.96);
			opacity: 0;
		}
	}

	@media (max-width: 48rem) {
		.origin-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
