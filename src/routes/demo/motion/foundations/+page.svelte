<script lang="ts">
	import DurationComparisonExample from './DurationComparisonExample.svelte';
	import EasingComparisonExample from './EasingComparisonExample.svelte';
	import DistanceComparisonExample from './DistanceComparisonExample.svelte';
	import OriginComparisonExample from './OriginComparisonExample.svelte';
	import StaggerGroupsExample from './StaggerGroupsExample.svelte';
	let run = $state(0);
</script>

<div class="page-stack">
	<header class="page-heading">
		<p>01 · Grundlagen</p>
		<h2>Gleiche Geometrie, andere semantische Aufgabe</h2>
		<span
			>Komplexität bleibt bewusst niedrig, damit Dauer, Kurve, Distanz und Ursprung isoliert
			vergleichbar sind.</span
		>
	</header>

	<DurationComparisonExample bind:run />

	<EasingComparisonExample bind:run />

	<DistanceComparisonExample bind:run />

	<OriginComparisonExample bind:run />

	<StaggerGroupsExample />
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
		max-width: 24ch;
		font-size: clamp(1.8rem, 4vw, 3.2rem);
		font-weight: 660;
		letter-spacing: -0.045em;
		line-height: 1;
	}
	.page-heading span {
		display: block;
		max-width: 60ch;
		margin-top: 0.75rem;
		color: var(--muted-foreground);
		font-size: 0.86rem;
		line-height: 1.55;
	}
</style>
