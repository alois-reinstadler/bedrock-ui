<script lang="ts">
	import ControlStatesExample from './ControlStatesExample.svelte';
	import ManyControlsExample from './ManyControlsExample.svelte';
	import AsyncControlExample from './AsyncControlExample.svelte';
	import AnchoredPlacementsExample from './AnchoredPlacementsExample.svelte';
	import DialogSurfacesExample from './DialogSurfacesExample.svelte';
	import EdgeSurfacesExample from './EdgeSurfacesExample.svelte';
</script>

<div class="page-stack">
	<header class="page-heading">
		<p>02 · Komponenten</p>
		<h2>Häufige Aktionen dürfen nicht ermüden</h2>
		<span
			>Reale Bedrock-Komponenten zeigen ihre vorhandenen Utility-Animationen. Die Metadaten
			beschreiben den Ist-Zustand, nicht die gewünschte Zukunft.</span
		>
	</header>

	<ControlStatesExample />

	<ManyControlsExample />

	<AsyncControlExample />

	<AnchoredPlacementsExample />

	<DialogSurfacesExample />

	<EdgeSurfacesExample />
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
		max-width: 65ch;
		margin-top: 0.75rem;
		color: var(--muted-foreground);
		font-size: 0.86rem;
		line-height: 1.55;
	}
</style>
