<script lang="ts">
	import Feedback from './feedback.svelte';
	import type { FeedbackAnnotation, FeedbackMode, FeedbackPayload } from './types.js';
	let {
		storageKey,
		mode = 'developer',
		delivery = false
	}: { storageKey?: string; mode?: FeedbackMode; delivery?: boolean } = $props();
	let annotations = $state<FeedbackAnnotation[]>([]);
	let enabled = $state(true);
	let pageUrl = $state('/first');
	let activations = $state(0);
	let attempts = $state(0);
	let received = $state<FeedbackPayload | null>(null);
	async function submit(payload: FeedbackPayload) {
		attempts++;
		if (attempts === 1) throw new Error('Offline');
		received = payload;
	}
</script>

<div id="feedback-fixture">
	<h1 data-feedback-id="fixture-heading">A better website</h1>
	<button type="button" data-feedback-id="fixture-button" onclick={() => activations++}
		>Target action</button
	>
	<div id="private-parent">
		Public text <span data-feedback-ignore>Secret account number</span><textarea
			aria-label="Private text">Private draft</textarea
		>
	</div>
</div>
<div data-feedback-ignore>
	<button type="button" onclick={() => (enabled = !enabled)}>Toggle feedback</button>
	<button type="button" onclick={() => (pageUrl = pageUrl === '/first' ? '/second' : '/first')}
		>Change route</button
	>
	<output data-testid="activations">{activations}</output>
	<output data-testid="annotations">{JSON.stringify(annotations)}</output>
	<output data-testid="received">{JSON.stringify(received)}</output>
</div>
<Feedback
	bind:annotations
	{enabled}
	{mode}
	{pageUrl}
	{storageKey}
	scope="#feedback-fixture"
	onSubmit={delivery ? submit : undefined}
/>
