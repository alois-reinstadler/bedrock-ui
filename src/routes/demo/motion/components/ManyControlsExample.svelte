<script lang="ts">
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';

	import { Button } from '#lib/bedrock/ui/button';

	import { Switch } from '#lib/bedrock/ui/switch';

	let manyControls = $state(Array.from({ length: 30 }, (_, index) => index % 3 === 0));
	function toggleMany() {
		manyControls = manyControls.map((value) => !value);
	}
</script>

<Benchmark
	id="many-controls"
	title="30 gleichzeitige Zustandswechsel"
	summary="Select all aktualisiert echte Switches in einem Frame. Das entlarvt unnötige Bewegung und breite Transition-Claims."
	hardCase="Alle 30 umschalten, sofort erneut umschalten und während der Thumb-Transitions per Tastatur einen einzelnen Switch ändern."
	verdict="problem"
	finding="Jeder Switch animiert transition-all und zusätzlich transform am Thumb. Unter hoher Frequenz ist ein kürzerer oder praktisch sofortiger Zustandswechsel wahrscheinlich besser."
	metadata={{
		role: 'Zustandswechsel',
		duration: 'Tailwind default × 30',
		easing: 'Tailwind default',
		distance: '14 px Thumb',
		properties: 'background, border, transform; transition-all am Root',
		layout: 'Nein',
		loop: 'Nein',
		reduced: 'Lab-Override kürzt auf 80 ms; Bibliothek selbst tut dies noch nicht.'
	}}
>
	{#snippet actions()}<Button size="sm" onclick={toggleMany}>Alle umschalten</Button>{/snippet}
	<div class="switch-matrix">
		{#each manyControls as checked, index (index)}
			<label data-checked={checked}
				><Switch bind:checked={manyControls[index]} size="sm" /><span
					>{String(index + 1).padStart(2, '0')}</span
				></label
			>
		{/each}
	</div>
</Benchmark>

<style>
	.switch-matrix {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(4.3rem, 1fr));
		gap: 0.35rem;
	}
	.switch-matrix label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.4rem;
		border-radius: 0.65rem;
		background: var(--background);
		padding: 0.55rem;
	}
	.switch-matrix span {
		color: var(--muted-foreground);
		font-family: ui-monospace, monospace;
		font-size: 0.6rem;
	}
</style>
