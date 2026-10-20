<script lang="ts">
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';

	import { Button } from '#lib/bedrock/ui/button';

	import { Slider } from '#lib/bedrock/ui/slider';

	let compatibilityRun = $state(false);
</script>

<Benchmark
	id="external-compatibility"
	title="Externe Animation und Transform-Eigentum"
	summary="Ein Consumer-Transform auf einem Wrapper bleibt sicher. Derselbe Transform direkt auf Button/Card kollidiert mit Library-Press, Layout oder Entry-Utilities."
	hardCase="Externe Transform-Animation laufen lassen und Button währenddessen drücken beziehungsweise Slider ziehen. Prüfen, welche Transform-Quelle gewinnt."
	verdict="problem"
	finding="Bedrock layout() warnt bei authored transforms, kann sie aber nicht komponieren. Progress, Vaul, tw-animate-css und Consumer-Motion beanspruchen dieselbe CSS-Eigenschaft. Ein dokumentiertes Wrapper-Muster ist derzeit nötig."
	metadata={{
		role: 'Bewegung / Kontinuität',
		duration: 'Consumer 900 ms · Library press/default',
		easing: 'Consumer move · Library defaults',
		distance: '18 px + 2°',
		properties: 'transform (Kollision)',
		layout: 'Nein',
		loop: 'Ja',
		reduced: 'Consumer muss Preference selbst respektieren; Wrapper bleibt strukturell sicher.'
	}}
>
	{#snippet actions()}<Button
			size="sm"
			variant="outline"
			onclick={() => (compatibilityRun = !compatibilityRun)}
			>{compatibilityRun ? 'Stoppen' : 'Externe Motion'}</Button
		>{/snippet}
	<div class={['compat-grid', { running: compatibilityRun }]}>
		<div>
			<span>Sicher: Consumer transformiert Wrapper</span>
			<div class="consumer-wrapper lab-loop"><Button>Button im Wrapper</Button></div>
		</div>
		<div>
			<span>Konflikt: Consumer transformiert Button</span><Button class="consumer-direct lab-loop"
				>Direkter Transform</Button
			>
		</div>
		<div>
			<span>Direkte Manipulation im externen Wrapper</span>
			<div class="consumer-wrapper lab-loop">
				<Slider type="single" min={0} max={100} value={55} />
			</div>
		</div>
		<div>
			<span>Card / Layout-Transform-Kollision</span>
			<article class="consumer-direct lab-loop">
				<strong>Externe Card</strong>
				<p>Transform kann nicht additiv garantiert werden.</p>
			</article>
		</div>
	</div>
</Benchmark>

<style>
	.compat-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.55rem;
	}
	.compat-grid > div {
		min-height: 8rem;
		overflow: hidden;
		border-radius: 0.8rem;
		background: var(--background);
		padding: 0.8rem;
	}
	.compat-grid > div > span {
		display: block;
		margin-bottom: 1.5rem;
		color: var(--muted-foreground);
		font-size: 0.65rem;
	}
	.compat-grid article {
		border: 1px solid var(--border);
		border-radius: 0.65rem;
		padding: 0.7rem;
	}
	.compat-grid article p {
		margin-top: 0.2rem;
		color: var(--muted-foreground);
		font-size: 0.65rem;
	}
	.running .consumer-wrapper {
		animation: consumer-motion 900ms var(--ease-move) infinite alternate;
	}
	.running .consumer-direct {
		animation: consumer-motion 900ms var(--ease-move) infinite alternate;
	}

	@keyframes consumer-motion {
		to {
			transform: translateX(18px) rotate(2deg);
		}
	}

	@media (max-width: 42rem) {
		.compat-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
