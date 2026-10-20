<script lang="ts">
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';
	import { motionPresets } from '#lib/bedrock/motion/index.js';
	let { run = $bindable() }: { run: number } = $props();
	const durations = [
		['Press', 'press', motionPresets.press.duration],
		['State', 'state', motionPresets.state.duration],
		['Enter', 'enter', motionPresets.enter.duration],
		['Exit', 'exit', motionPresets.exit.duration],
		['Reveal', 'reveal', motionPresets.reveal.duration],
		['Overlay', 'overlay', motionPresets.overlay.duration],
		['Continuous', '—', 900]
	] as const;
</script>

<Benchmark
	id="duration-comparison"
	title="Dauervergleich"
	summary="Jeder Punkt legt dieselbe Distanz zurück. Nur der semantische Zeitwert ändert sich."
	hardCase="Mehrere Rollen gleichzeitig starten. Prüfen, ob Press wie Feedback und Overlay wie visuelles Gewicht wirkt – nicht bloß schnell beziehungsweise langsam."
	metadata={{
		role: 'Zustandswechsel',
		duration: 'motionPresets.press → overlay',
		easing: 'linear (isolierter Dauervergleich)',
		distance: '160 px',
		properties: 'transform',
		layout: 'Nein',
		loop: 'Nein',
		reduced: 'Alle Punkte springen ins Ziel; Beschriftung bleibt erhalten.'
	}}
>
	{#snippet actions()}<button type="button" onclick={() => (run += 1)}>Abspielen</button>{/snippet}
	{#key run}
		<div class="tracks">
			{#each durations as [label, token, duration] (label)}
				<div class="track-row">
					<span><strong>{label}</strong><small>{token} · {duration} ms</small></span>
					<div class="track">
						<i class="runner lab-animated lab-spatial" style:--duration={`${duration}ms`}></i>
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
