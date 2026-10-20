<script lang="ts">
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';
	import { useMotionLabState } from '#lib/site/motion-lab/context.svelte.js';
	import { Button } from '#lib/bedrock/ui/button';
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	import { Progress } from '#lib/bedrock/ui/progress';
	import { Skeleton } from '#lib/bedrock/ui/skeleton';
	import { Spinner } from '#lib/bedrock/ui/spinner';
	import { Slider } from '#lib/bedrock/ui/slider';
	let { progress = $bindable() }: { progress: number } = $props();
	const lab = useMotionLabState();
	let loaded = $state(false);
	let longRunning = $state(true);
	let instanceCount = $derived(
		lab.stressMode === 'many' ? 48 : lab.stressMode === 'rapid' ? 20 : 8
	);
</script>

<Benchmark
	id="continuous-motion"
	title="Kontinuierliche Motion und Langzeitkadenz"
	summary="Echte Spinner, determinate Progress und Skeletons laufen einzeln und als Gruppe. Loading → Loaded beendet alle Schleifen."
	hardCase="48 Instanzen lange laufen lassen, Tab im Hintergrund lassen, dann Reduced aktivieren und Loading → Loaded wechseln. Keine Schleife darf unsichtbar weiterarbeiten."
	verdict="problem"
	finding="Spinner, Skeleton, OTP-Caret und Sonner-Loader haben keinen gemeinsamen Cadence-Token und ignorieren die Bedrock-Reduced-Policy."
	metadata={{
		role: 'Kontinuierliche Bewegung',
		duration: 'Utility-Defaults; keine Bedrock-Cadence-Tokens',
		easing: 'linear spin / pulse default',
		properties: 'transform, opacity',
		layout: 'Nein',
		loop: 'Ja',
		reduced: 'Lab stoppt Schleifen; Bibliothek selbst derzeit nicht.'
	}}
>
	{#snippet actions()}<Button size="sm" onclick={() => (loaded = !loaded)}
			>{loaded ? 'Loading zeigen' : 'Als geladen markieren'}</Button
		>{/snippet}
	<div class="continuous-summary">
		<label><Checkbox bind:checked={longRunning} /> Langzeitbewegung aktiv</label><span
			>{instanceCount} Instanzen · Stress: {lab.stressMode}</span
		>
	</div>
	{#if loaded}
		<div class="loaded-state">
			<strong>Inhalt geladen</strong><span>Keine versteckte Schleife sollte weiterlaufen.</span>
		</div>
	{:else}
		<div class={['continuous-grid', { stopped: !longRunning }]}>
			{#each Array.from(Array(instanceCount).keys()) as index (index)}
				<div>
					<Spinner class="lab-loop" aria-label="Wird geladen" /><Skeleton
						class="lab-loop h-2 w-full"
					/><span>{index + 1}</span>
				</div>
			{/each}
		</div>
	{/if}
	<div class="progress-row">
		<Progress value={progress} max={100} /><span>{progress}%</span><Slider
			type="single"
			min={0}
			max={100}
			bind:value={progress}
		/>
	</div>
</Benchmark>

<style>
	.continuous-summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.7rem;
		color: var(--muted-foreground);
		font-size: 0.68rem;
	}
	.continuous-summary label {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}
	.continuous-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
		gap: 0.35rem;
	}
	.continuous-grid > div {
		display: grid;
		min-height: 4.5rem;
		align-content: center;
		justify-items: center;
		gap: 0.5rem;
		border-radius: 0.65rem;
		background: var(--background);
		padding: 0.5rem;
	}
	.continuous-grid span {
		color: var(--muted-foreground);
		font-family: ui-monospace, monospace;
		font-size: 0.55rem;
	}
	.continuous-grid.stopped :global(.lab-loop) {
		animation-play-state: paused;
	}
	.loaded-state {
		display: grid;
		min-height: 8rem;
		place-content: center;
		text-align: center;
	}
	.loaded-state span {
		margin-top: 0.2rem;
		color: var(--muted-foreground);
		font-size: 0.7rem;
	}
	.progress-row {
		display: grid;
		grid-template-columns: minmax(6rem, 1fr) auto minmax(8rem, 1fr);
		align-items: center;
		gap: 0.7rem;
		margin-top: 0.8rem;
	}
	.progress-row span {
		font-variant-numeric: tabular-nums;
		color: var(--muted-foreground);
		font-size: 0.68rem;
	}
</style>
