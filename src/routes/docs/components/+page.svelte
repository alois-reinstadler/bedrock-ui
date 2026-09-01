<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge } from '#lib/bedrock/ui/badge';
	import { components } from '#lib/site/registry';

	const groups = [
		{ id: 'content', label: 'Content' },
		{ id: 'form', label: 'Form' },
		{ id: 'data', label: 'Data' },
		{ id: 'layout', label: 'Layout' },
		{ id: 'overlay', label: 'Overlay' },
		{ id: 'display', label: 'Display' },
		{ id: 'navigation', label: 'Navigation' }
	] as const;
</script>

<svelte:head>
	<title>Components — Bedrock</title>
	<meta name="description" content="Index of Bedrock UI primitives." />
</svelte:head>

<article class="mx-auto max-w-3xl px-4 py-10 md:px-8">
	<p class="font-mono text-xs tracking-wide text-muted-foreground uppercase">Docs</p>
	<h1 class="mt-2 text-3xl font-medium tracking-tight">Components</h1>
	<p class="mt-4 max-w-[62ch] text-base leading-relaxed text-muted-foreground">
		{components.length} primitives. Open a page for the import path and, where it exists, a live example.
	</p>

	<div class="mt-10 space-y-10">
		{#each groups as group (group.id)}
			<section>
				<h2 class="text-sm font-medium tracking-tight">{group.label}</h2>
				<ul class="mt-3 divide-y overflow-hidden rounded-xl ring-1 ring-foreground/10">
					{#each components.filter((item) => item.category === group.id) as component (component.slug)}
						<li>
							<a
								href={resolve('/docs/components/[slug]', { slug: component.slug })}
								class="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/60"
							>
								<span>
									<span class="block text-sm font-medium">{component.title}</span>
									<span class="block text-sm text-muted-foreground">{component.description}</span>
								</span>
								<Badge variant="outline" class="shrink-0 font-mono text-[11px]"
									>{component.slug}</Badge
								>
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</article>
