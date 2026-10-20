<script lang="ts">
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';
	import { motionPresets, springEase, swapSpringEase } from '#lib/bedrock/motion/index.js';
	let { run = $bindable() }: { run: number } = $props();
	function sampleEasing(easing: (time: number) => number) {
		return `linear(${Array.from({ length: 25 }, (_, index) => easing(index / 24).toFixed(4)).join(', ')})`;
	}
	const curves = [
		['Enter', `cubic-bezier(${motionPresets.enter.easing.join(', ')})`],
		['Exit', `cubic-bezier(${motionPresets.exit.easing.join(', ')})`],
		['Movement', `cubic-bezier(${motionPresets.move.easing.join(', ')})`],
		['Drawer', `cubic-bezier(${motionPresets.drawer.easing.join(', ')})`],
		['Layout spring', sampleEasing(springEase)],
		['Swap spring', sampleEasing(swapSpringEase)],
		['Linear', 'linear']
	] as const;
</script>

<Benchmark
	id="easing-comparison"
	title="Kurven- und Federvergleich"
	summary="Gleiche Dauer und Distanz. Die beiden Federn werden direkt aus Bedrocks Easing-Funktionen als CSS linear()-Samples erzeugt."
	hardCase="Bewegung nach der Hälfte umkehren. Kurven mit starkem Anlauf zeigen, ob eine neue Zielrichtung zunächst gegen die sichtbare Geschwindigkeit arbeitet."
	metadata={{
		role: 'Bewegung / Kontinuität',
		duration: 'motionPresets.layout.duration · 500 ms',
		easing: 'enter, exit, move, drawer, layout spring, swap spring, linear',
		distance: '160 px',
		properties: 'transform',
		layout: 'Nein',
		loop: 'Nein',
		reduced: 'Translation entfernt; Endzustand bleibt eindeutig.'
	}}
>
	{#snippet actions()}<button type="button" onclick={() => (run += 1)}>Abspielen</button>{/snippet}
	{#key run}
		<div class="tracks">
			{#each curves as [label, curve] (label)}
				<div class="track-row">
					<span
						><strong>{label}</strong><small
							>{label.includes('spring') ? 'Bedrock spring' : curve}</small
						></span
					>
					<div class="track">
						<i
							class="runner lab-animated lab-spatial"
							style:--duration={`${motionPresets.layout.duration}ms`}
							style:--curve={curve}
						></i>
					</div>
				</div>
			{/each}
		</div>
	{/key}
</Benchmark>

<style>
	.tracks {
		display: grid;
		gap: 0.55rem;
	}
	.track-row {
		display: grid;
		grid-template-columns: minmax(7rem, 0.28fr) 1fr;
		align-items: center;
		gap: 1rem;
	}
	.track-row span,
	.track-row strong,
	.track-row small {
		display: block;
	}
	.track-row strong {
		font-size: 0.75rem;
	}
	.track-row small {
		margin-top: 0.08rem;
		overflow: hidden;
		color: var(--muted-foreground);
		font-family: ui-monospace, monospace;
		font-size: 0.58rem;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.track {
		position: relative;
		height: 1.5rem;
		border-radius: 999px;
		background: color-mix(in oklab, var(--border), transparent 35%);
	}
	.track::after {
		position: absolute;
		inset-block: 0.3rem;
		right: 0.4rem;
		width: 1px;
		background: var(--muted-foreground);
		content: '';
		opacity: 0.5;
	}
	.runner {
		--curve: linear;
		position: absolute;
		top: 0.25rem;
		left: 0.25rem;
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: var(--foreground);
		animation: travel calc(var(--duration) * var(--lab-time-scale)) var(--curve) both;
	}

	@keyframes travel {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(calc(100cqw - 1.5rem));
		}
	}

	.track {
		container-type: inline-size;
	}

	@media (max-width: 34rem) {
		.track-row {
			grid-template-columns: 1fr;
			gap: 0.25rem;
		}
	}
</style>
