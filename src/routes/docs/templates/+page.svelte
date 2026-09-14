<script lang="ts">
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Input } from '#lib/bedrock/ui/input';
	import { templates } from '#lib/site/templates.js';
	let query = $state('');
	const visible = $derived(
		templates.filter((item) =>
			`${item.title} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase())
		)
	);
</script>

<svelte:head>
	<title>Templates — Bedrock</title>
	<meta
		name="description"
		content="Four complete, responsive product templates built with public Bedrock components. Explore music, video, email, and community interfaces."
	/>
</svelte:head>

<article class="mx-auto max-w-7xl px-4 py-10 md:px-8" data-doc-slug="templates">
	<p class="mb-3 text-xs font-medium tracking-widest text-muted-foreground uppercase">
		From primitives to products
	</p>
	<h1 class="text-4xl font-medium tracking-tight md:text-5xl">Templates</h1>
	<p class="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
		Complete product surfaces you can explore, adapt, and own. Each template brings Bedrock
		components together with realistic local data and working interactions.
	</p>
	<p class="mt-3 max-w-2xl text-sm text-muted-foreground">
		A component focuses on one interaction. A block packages a reusable product pattern. A template
		supplies the complete page and application shell.
	</p>
	<div class="mt-8 max-w-sm">
		<label for="template-search" class="mb-2 block text-sm font-medium">Find a template</label>
		<Input
			id="template-search"
			type="search"
			value={query}
			oninput={(event) => (query = event.currentTarget.value)}
			placeholder="Music, messages, community…"
		/>
	</div>
	<p role="status" class="mt-3 text-sm text-muted-foreground">
		{visible.length}
		{visible.length === 1 ? 'template' : 'templates'}
	</p>
	<div class="mt-6 grid gap-8 xl:grid-cols-2">
		{#each visible as template (template.slug)}
			<article class="overflow-hidden rounded-2xl border bg-card">
				<a
					href={`/templates/${template.slug}`}
					class="group block rounded-t-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
					aria-label={`Explore ${template.title}`}
				>
					<div class="aspect-[16/10] overflow-hidden border-b bg-muted">
						<img
							src={template.thumbnail}
							alt={`${template.title} desktop preview`}
							width="1440"
							height="900"
							loading="lazy"
							class="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
						/>
					</div>
					<div class="px-6 pt-5">
						<h2 class="text-xl font-medium">
							{template.title}<span aria-hidden="true" class="ml-2 text-muted-foreground">↗</span>
						</h2>
					</div>
				</a>
				<div class="px-6 pt-2 pb-6">
					<p class="min-h-12 text-sm leading-relaxed text-muted-foreground">
						{template.description}
					</p>
					<div class="mt-4 flex flex-wrap gap-2">
						{#each template.layouts as layout (layout)}<Badge variant="outline">{layout}</Badge
							>{/each}
					</div>
					<details class="mt-5 text-sm">
						<summary
							class="cursor-pointer rounded py-1 font-medium focus-visible:outline-2 focus-visible:outline-ring"
							>Built with Bedrock</summary
						>
						<p class="mt-2 leading-relaxed text-muted-foreground">
							{template.components.join(', ')}. {template.blocks.length
								? `Blocks: ${template.blocks.join(', ')}.`
								: 'Composed directly from public components.'}
						</p>
					</details>
				</div>
			</article>
		{:else}
			<p class="rounded-xl border border-dashed p-8 text-muted-foreground">
				No templates match “{query}”. Try “music”, “video”, “email”, or “social”.
			</p>
		{/each}
	</div>
</article>
