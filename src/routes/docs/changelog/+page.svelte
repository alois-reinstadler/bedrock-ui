<script lang="ts">
	import { releases } from './releases';
	import { Badge } from '#lib/bedrock/ui/badge';
	import * as Empty from '#lib/bedrock/ui/empty';
	import DocsPageHeader from '#lib/site/DocsPageHeader.svelte';
</script>

<svelte:head><title>Changelog — Bedrock</title><meta name="robots" content="noindex" /></svelte:head
>

<article class="mx-auto max-w-4xl px-4 py-10 md:px-8">
	<div class="flex items-start justify-between gap-6">
		<DocsPageHeader
			title="Changelog"
			description="Public release notes will track additions, behavior changes, migrations, and resolved accessibility gaps."
		/><Badge variant="outline">Pre-release</Badge>
	</div>
	{#if releases.length === 0}
		<Empty.Root class="mt-12 rounded-2xl border py-16">
			<Empty.Header
				><Empty.Title>No public releases yet</Empty.Title><Empty.Description
					>This page is ready, but it stays out of navigation until Bedrock publishes its first
					version.</Empty.Description
				></Empty.Header
			>
		</Empty.Root>
	{:else}
		{#each releases as release (release.version)}
			<article class="mt-10 rounded-xl border p-6">
				<h2 class="text-xl font-medium">{release.version}</h2>
				<time datetime={release.date} class="text-sm text-muted-foreground">{release.date}</time>
				<p class="mt-3">{release.summary}</p>
				{#each [['Additions', release.additions], ['Changes', release.changes], ['Migrations', release.migrations], ['Accessibility', release.accessibility]] as const as section (section[0])}
					<h3 class="mt-5 font-medium">{section[0]}</h3>
					<ul class="mt-2 list-disc pl-5">
						{#each section[1] as item (item)}<li>{item}</li>{/each}
					</ul>
				{/each}
			</article>
		{/each}
	{/if}
</article>
