<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import DocsPageHeader from '#lib/site/DocsPageHeader.svelte';
	import { tools, toolHref } from '#lib/site/tools.js';
</script>

<svelte:head>
	<title>Tools — Bedrock</title>
	<meta
		name="description"
		content="Tools for inspecting, annotating, and reviewing live interfaces with Bedrock."
	/>
</svelte:head>

<article class="mx-auto max-w-5xl px-4 py-10 md:px-8">
	<DocsPageHeader
		title="Tools"
		description="Complete workflows for working with live interfaces: inspect a page, collect notes, review changes, and export the result."
	/>
	<ul class="mt-10 grid gap-4 sm:grid-cols-2">
		{#each tools as tool (tool.slug)}
			<li>
				<a
					href={toolHref(tool)}
					class="group block h-full rounded-xl border bg-card p-6 transition-colors hover:border-foreground/30 hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none"
				>
					<h2 class="flex items-center justify-between gap-4 text-lg font-semibold">
						{tool.title}<ArrowRightIcon class="size-4 shrink-0" aria-hidden="true" />
					</h2>
					<p class="mt-3 text-sm leading-relaxed text-muted-foreground">{tool.description}</p>
				</a>
			</li>
		{/each}
	</ul>
</article>
