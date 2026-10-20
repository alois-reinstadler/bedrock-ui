<script lang="ts">
	import ReducedMotionMatrixExample from './ReducedMotionMatrixExample.svelte';
	import ContinuousMotionExample from './ContinuousMotionExample.svelte';
	import PerformanceScaleExample from './PerformanceScaleExample.svelte';
	import ExternalCompatibilityExample from './ExternalCompatibilityExample.svelte';
	let progress = $state(36);
</script>

<div class="page-stack">
	<header class="page-heading">
		<p>05 · Zugänglichkeit & Last</p>
		<h2>Reduced Motion ist eine andere Sprache, nicht Stille</h2>
		<span
			>Räumliche Bewegung und Schleifen dürfen verschwinden, während Farbe, Fokus, Status und kurze
			Opacity weiterhin absichtsvoll kommunizieren.</span
		>
	</header>

	<ReducedMotionMatrixExample />

	<ContinuousMotionExample bind:progress />

	<PerformanceScaleExample bind:progress />

	<ExternalCompatibilityExample />
</div>

<style>
	.page-stack {
		display: grid;
		gap: 1.25rem;
	}
	.page-heading {
		padding: 0.5rem 0 0.75rem;
	}
	.page-heading p {
		color: var(--muted-foreground);
		font-size: 0.7rem;
		font-weight: 650;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.page-heading h2 {
		margin-top: 0.3rem;
		max-width: 25ch;
		font-size: clamp(1.8rem, 4vw, 3.2rem);
		font-weight: 660;
		letter-spacing: -0.045em;
		line-height: 1;
	}
	.page-heading span {
		display: block;
		max-width: 65ch;
		margin-top: 0.75rem;
		color: var(--muted-foreground);
		font-size: 0.86rem;
		line-height: 1.55;
	}
</style>
