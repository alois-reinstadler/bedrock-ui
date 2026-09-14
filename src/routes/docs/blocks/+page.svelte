<script lang="ts">
	import { resolve } from '$app/paths';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { Badge } from '#lib/bedrock/ui/badge';
	import * as Card from '#lib/bedrock/ui/card';
	import { Button } from '#lib/bedrock/ui/button';
	import { Input } from '#lib/bedrock/ui/input';
	import DocsPageHeader from '#lib/site/DocsPageHeader.svelte';
	import { blocks } from '#lib/site/blocks.js';
	let query = $state('');
	let category = $state('all');
	let filtered = $derived(
		blocks.filter(
			(block) =>
				(category === 'all' || block.category === category) &&
				`${block.title} ${block.description}`.toLowerCase().includes(query.toLowerCase())
		)
	);
</script>

<svelte:head>
	<title>Blocks — Bedrock</title>
	<meta name="description" content="Reusable product patterns composed from Bedrock components." />
</svelte:head>

<article class="mx-auto max-w-5xl px-4 py-10 md:px-8">
	<DocsPageHeader
		title="Blocks"
		description="Reusable product patterns built from several Bedrock components. Blocks solve a recurring workflow while leaving product data and business rules in your application."
	/>
	<div class="mt-8 flex flex-wrap gap-3">
		<label class="min-w-48 flex-1"
			>Search blocks<Input
				type="search"
				value={query}
				oninput={(event) => (query = event.currentTarget.value)}
				placeholder="Search product patterns"
			/></label
		><label
			>Category<select bind:value={category} class="mt-1 block rounded-md border bg-background p-2"
				><option value="all">All categories</option><option value="forms">Forms</option><option
					value="data">Data</option
				><option value="settings">Settings</option></select
			></label
		>
	</div>
	<p role="status" class="mt-3 text-sm text-muted-foreground">
		{filtered.length
			? `${filtered.length} blocks`
			: 'No blocks match. Try a different search or category.'}
	</p>
	<div class="mt-10 grid gap-6 xl:grid-cols-2">
		{#each filtered as block (block.slug)}
			<Card.Root class="overflow-hidden">
				<Card.Content class="border-b bg-muted/30 p-6"
					><p class="text-xs tracking-wide text-muted-foreground uppercase">{block.category}</p>
					<div class="mt-4 flex flex-wrap gap-2">
						{#each block.components as name (name)}<Badge variant="outline">{name}</Badge>{/each}
					</div></Card.Content
				>
				<Card.Header>
					<div class="flex items-center justify-between gap-3">
						<Card.Title>{block.title}</Card.Title>
						<Badge variant="outline">{block.category}</Badge>
					</div>
					<Card.Description>{block.description}</Card.Description>
				</Card.Header>
				<Card.Footer>
					<Button href={resolve('/docs/blocks/[slug]', { slug: block.slug })} variant="outline">
						Open block <ArrowRightIcon data-icon="inline-end" />
					</Button>
				</Card.Footer>
			</Card.Root>
		{/each}
	</div>
</article>
