<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Button } from '#lib/bedrock/ui/button';
	import * as Card from '#lib/bedrock/ui/card';
	import DocsPageHeader from '#lib/site/DocsPageHeader.svelte';
	import { blocks } from '#lib/site/blocks.js';
	import { components } from '#lib/site/registry';

	const collections = [
		{
			title: 'Components',
			description: 'Focused UI primitives and families with public APIs.',
			href: '/docs/components',
			count: `${components.length} documented`
		},
		{
			title: 'Blocks',
			description: 'Reusable multi-component patterns for recurring workflows.',
			href: '/docs/blocks',
			count: `${blocks.length} starting points`
		},
		{
			title: 'Templates',
			description: 'Complete responsive application shells built with Bedrock.',
			href: '/docs/templates',
			count: '4 full-page experiences'
		}
	] as const;
</script>

<svelte:head>
	<title>Documentation — Bedrock</title>
	<meta
		name="description"
		content="Build product interfaces from Bedrock components, blocks, and templates."
	/>
</svelte:head>

<article class="mx-auto max-w-5xl px-4 py-10 md:px-8">
	<DocsPageHeader
		title="Build from stable foundations."
		description="Bedrock is an in-tree Svelte design system: accessible primitives, reusable product patterns, and complete application shells that your team can inspect and own."
	/>

	<section class="mt-10 grid gap-5 lg:grid-cols-3" aria-label="Documentation collections">
		{#each collections as collection (collection.href)}
			<Card.Root>
				<Card.Header>
					<div class="flex items-start justify-between gap-3">
						<Card.Title>{collection.title}</Card.Title><Badge variant="outline"
							>{collection.count}</Badge
						>
					</div>
					<Card.Description>{collection.description}</Card.Description>
				</Card.Header>
				<Card.Footer
					><Button href={collection.href} variant="outline"
						>Explore {collection.title.toLowerCase()}
						<ArrowRightIcon data-icon="inline-end" /></Button
					></Card.Footer
				>
			</Card.Root>
		{/each}
	</section>

	<section class="mt-16" aria-labelledby="model-heading">
		<p class="font-mono text-xs tracking-wide text-muted-foreground uppercase">Ownership model</p>
		<h2 id="model-heading" class="mt-2 text-2xl font-medium tracking-tight">
			Choose the smallest useful layer.
		</h2>
		<div class="mt-6 overflow-hidden rounded-2xl border">
			{#each [['Component', 'A focused primitive or related family.', 'Use it to compose your own product behavior.'], ['Block', 'A reusable multi-component product pattern.', 'Use it when the workflow repeats but the data differs.'], ['Template', 'A complete page or application shell.', 'Use it to accelerate a whole product surface.']] as row, index (row[0])}
				<div class="grid gap-2 bg-card p-5 sm:grid-cols-[8rem_1fr_1fr]" class:border-t={index > 0}>
					<strong class="text-sm">{row[0]}</strong><span class="text-sm text-muted-foreground"
						>{row[1]}</span
					><span class="text-sm">{row[2]}</span>
				</div>
			{/each}
		</div>
	</section>

	<section class="mt-16 grid gap-5 md:grid-cols-3" aria-label="Bedrock principles">
		{#each [['Accessible by contract', 'Keyboard, focus, labeling, contrast, and reduced motion are documented behavior—not polish added later.'], ['Motion with intent', 'Shared tokens keep feedback quick, spatial changes legible, and exits quieter than entrances.'], ['Source you can own', 'Stable local imports let teams change implementation details without rewriting product code.']] as principle (principle[0])}
			<div class="rounded-2xl border p-5">
				<h2 class="font-medium">{principle[0]}</h2>
				<p class="mt-2 text-sm leading-relaxed text-muted-foreground">{principle[1]}</p>
			</div>
		{/each}
	</section>
</article>
