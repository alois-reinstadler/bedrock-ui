<script lang="ts">
	import ToastStackExample from './ToastStackExample.svelte';
	import AsyncAndValidationExample from './AsyncAndValidationExample.svelte';
	import DynamicListExample from './DynamicListExample.svelte';
	import InterruptibilityLabExample from './InterruptibilityLabExample.svelte';
	import ShouldThisAnimateExample from './ShouldThisAnimateExample.svelte';
</script>

<div class="page-stack">
	<header class="page-heading">
		<p>04 · Gleichzeitigkeit</p>
		<h2>Die echte Prüfung beginnt, wenn nichts allein animiert</h2>
		<span
			>Eintritt, Austritt, Reflow, Validierung und neue Ziele überlappen absichtlich. Endzustand und
			Orientierung zählen mehr als die Choreografie.</span
		>
	</header>

	<ToastStackExample />

	<AsyncAndValidationExample />

	<DynamicListExample />

	<InterruptibilityLabExample />

	<ShouldThisAnimateExample />
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
