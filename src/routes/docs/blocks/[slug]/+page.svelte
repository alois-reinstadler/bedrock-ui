<script lang="ts">
	import { onMount } from 'svelte';
	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});
	import { page } from '$app/state';
	import { Button } from '#lib/bedrock/ui/button';
	import * as Card from '#lib/bedrock/ui/card';
	import ApiTable from '#lib/site/component-docs/ApiTable.svelte';
	import BlockPreview from '#lib/site/BlockPreview.svelte';
	import HighlightedCode from '#lib/site/HighlightedCode.svelte';
	import DocsPageHeader from '#lib/site/DocsPageHeader.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	// The outgoing leaf can receive the next route's data before it is destroyed.
	let block = $derived(data.block as typeof data.block | undefined);
	let tab = $derived(
		mounted && page.url.searchParams.get('tab') === 'properties' ? 'properties' : 'overview'
	);
</script>

<svelte:head>
	<title>{block ? `${block.title} block` : 'Blocks'} — Bedrock</title>
	<meta name="description" content={block?.description ?? 'Bedrock block documentation'} />
</svelte:head>

{#if block}
	<article
		data-doc-slug={block.slug}
		data-doc-tab={tab}
		class="mx-auto max-w-5xl px-4 py-10 md:px-8"
	>
		<DocsPageHeader eyebrow="Block" title={block.title} description={block.description} />
		<nav data-sveltekit-reload="off" aria-label="Block reference" class="mt-7 flex gap-1 border-b">
			<Button
				href="?tab=overview"
				variant={tab === 'overview' ? 'secondary' : 'ghost'}
				aria-current={tab === 'overview' ? 'page' : undefined}>Overview</Button
			>
			<Button
				href="?tab=properties"
				variant={tab === 'properties' ? 'secondary' : 'ghost'}
				aria-current={tab === 'properties' ? 'page' : undefined}>Properties</Button
			>
		</nav>

		{#if tab === 'properties'}
			<section class="mt-10" aria-labelledby="properties-heading">
				<h2 id="properties-heading" class="text-2xl font-medium tracking-tight">Properties</h2>
				<p class="mt-2 text-muted-foreground">
					The public configuration surface. Product data remains owned by the consuming application.
				</p>
				<div class="mt-6">
					<ApiTable
						entries={block.properties.map((property) => ({
							...property,
							kind: property.kind === 'callback' ? 'event' : (property.kind ?? 'prop')
						}))}
					/>
				</div>
			</section>
		{:else}
			<div class="mt-10 space-y-14">
				<section aria-labelledby="installation-heading">
					<h2 id="installation-heading" class="text-2xl font-medium tracking-tight">
						Installation
					</h2>
					<p class="mt-2 mb-4 text-muted-foreground">
						Copy the block source into your project, then import its stable Bedrock entry.
					</p>
					<HighlightedCode code={data.importCode} html={data.importHtml} />
				</section>
				<section aria-labelledby="usage-heading">
					<h2 id="usage-heading" class="text-2xl font-medium tracking-tight">Usage</h2>
					<div class="mt-5 grid gap-5 md:grid-cols-2">
						<Card.Root
							><Card.Header
								><Card.Title>What it is</Card.Title><Card.Description
									>A reusable, opinionated composition for a recurring product workflow.</Card.Description
								></Card.Header
							></Card.Root
						>
						<Card.Root
							><Card.Header
								><Card.Title>What it is not</Card.Title><Card.Description
									>A replacement for your validation, permissions, routing, or domain data.</Card.Description
								></Card.Header
							></Card.Root
						>
					</div>
				</section>
				<section aria-labelledby="anatomy-heading">
					<h2 id="anatomy-heading" class="text-2xl font-medium tracking-tight">Anatomy</h2>
					<div class="mt-5 grid gap-4 md:grid-cols-2">
						{#each block.anatomy as part (part.name)}
							<Card.Root
								><Card.Header
									><Card.Title class="text-base">{part.name}</Card.Title><Card.Description
										>{part.description}</Card.Description
									></Card.Header
								></Card.Root
							>
						{/each}
					</div>
					<p class="mt-4 text-sm text-muted-foreground">
						Built with {block.components.join(', ')}.
					</p>
				</section>
				<section aria-labelledby="practices-heading">
					<h2 id="practices-heading" class="text-2xl font-medium tracking-tight">Best practices</h2>
					<ul class="mt-4 space-y-3">
						{#each block.bestPractices as practice (practice)}
							<li class="rounded-xl border bg-card px-4 py-3 text-sm">{practice}</li>
						{/each}
					</ul>
				</section>
				<section aria-labelledby="examples-heading">
					<h2 id="examples-heading" class="text-2xl font-medium tracking-tight">Examples</h2>
					<p class="mt-2 mb-5 text-muted-foreground">
						A working baseline to adapt to your product language and data.
					</p>
					<BlockPreview kind={block.slug} />
				</section>
			</div>
		{/if}
	</article>
{/if}
