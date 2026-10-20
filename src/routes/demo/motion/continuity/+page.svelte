<script lang="ts">
	import TabsContinuityExample from './TabsContinuityExample.svelte';
	import DirectionalNavigationExample from './DirectionalNavigationExample.svelte';
	import DisclosureHeightsExample from './DisclosureHeightsExample.svelte';
	import TableExpansionExample from './TableExpansionExample.svelte';
	import DirectManipulationExample from './DirectManipulationExample.svelte';
	import SortableLayoutExample from './SortableLayoutExample.svelte';
</script>

<div class="page-stack">
	<header class="page-heading">
		<p>03 · Kontinuität & Layout</p>
		<h2>Das Auge verfolgt Objekte, nicht Zustandsnamen</h2>
		<span
			>Navigation behält Richtung, Offenlegung hält den Layoutfluss verständlich und direkte
			Manipulation bleibt ohne Easing am Input.</span
		>
	</header>

	<TabsContinuityExample />

	<DirectionalNavigationExample />

	<DisclosureHeightsExample />

	<TableExpansionExample />

	<DirectManipulationExample />

	<SortableLayoutExample />
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
