<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { NativeSelect } from '#lib/bedrock/ui/native-select';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { Feedback, type FeedbackMode } from '#lib/bedrock/ui/feedback';
	import { Button } from '#lib/bedrock/ui/button';
	import { templates } from '#lib/site/templates.js';
	let mode = $state<FeedbackMode>('review');
	let count = $state(0);
	let open = $state(false);
	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
	let trigger = $state<HTMLButtonElement | HTMLAnchorElement | null>(null);
	const id = $props.id();
</script>

<!-- Avoid speculative route forks when the composer exposes a template link under the pointer. -->
<section
	class="w-full max-w-2xl space-y-5"
	aria-label="Feedback example"
	data-sveltekit-preload-data={open ? 'off' : undefined}
>
	<div class="flex flex-wrap items-center justify-between gap-3" data-feedback-ignore>
		<div>
			<h3 class="font-semibold">Review a real page</h3>
			<p class="text-sm text-muted-foreground">
				Open feedback, choose Select element, then click or drag a box inside the sample below.
			</p>
		</div>
		<label class="flex items-center gap-2 text-sm"
			>Mode<NativeSelect
				bind:value={mode}
				class={['control-site-examples-feedback', 'bg-background']}
				><option value="review">Customer review</option><option value="developer">Developer</option
				></NativeSelect
			></label
		>
	</div>
	<Button
		bind:ref={trigger}
		disabled={!ready}
		onclick={() => (open = true)}
		aria-expanded={open}
		data-feedback-ignore>Review this sample</Button
	>
	<Card.Root {id} class="block gap-0 p-7" data-feedback-sample>
		<p class="mb-4 text-xs tracking-widest text-muted-foreground uppercase">Studio / Fieldwork</p>
		<h4 data-feedback-id="feedback-demo-title" class="max-w-sm text-3xl font-medium tracking-tight">
			Good ideas deserve room to grow.
		</h4>
		<p class="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
			A quiet workspace for your next big thing. Bring your team, find your focus, and make
			something that matters.
		</p>
		<Button class="mt-6" data-feedback-id="feedback-demo-button" onclick={() => count++}
			>Explore the studio</Button
		>
		<p class="mt-3 text-xs text-muted-foreground" role="status">
			{count === 0
				? 'Try selecting the button without activating it.'
				: `Button activated ${count} times.`}
		</p>
	</Card.Root>
	<p class="text-xs text-muted-foreground" data-feedback-ignore>
		This demo saves drafts in your browser. Export them to share; it does not send feedback to a
		server.
	</p>
	<div class="space-y-3 border-t pt-5" data-feedback-ignore>
		<h4 class="text-sm font-medium">Review a full template</h4>
		<div class="grid gap-2 sm:grid-cols-2">
			{#each templates as template (template.slug)}
				<Button
					href={`/templates/${template.slug}?feedback=review`}
					variant="outline"
					class="justify-start">{template.title}</Button
				>
			{/each}
		</div>
		<p class="text-xs text-muted-foreground">
			Switch to developer annotations in the template’s feedback options.
		</p>
	</div>
</section>

<Feedback
	bind:open
	{trigger}
	{mode}
	project="Fieldwork demo"
	scope={`[id="${id}"]`}
	pageUrl={`${page.url.origin}${page.url.pathname}`}
	storageKey="bedrock:feedback-demo:v1"
/>
