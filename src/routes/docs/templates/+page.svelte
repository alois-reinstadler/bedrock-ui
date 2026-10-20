<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Input } from '#lib/bedrock/ui/input';
	import { Button } from '#lib/bedrock/ui/button';
	import MessageSquarePlus from '@lucide/svelte/icons/message-square-plus';
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
	<aside
		class="mt-8 flex flex-col gap-4 rounded-xl border bg-muted/30 p-5 corner-theme sm:flex-row sm:items-center sm:justify-between"
		aria-label="Feedback on live templates"
	>
		<div class="max-w-2xl">
			<p class="flex items-center gap-2 font-medium">
				<MessageSquarePlus class="size-4" />Try Page annotations on a real interface
			</p>
			<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
				Open a customer review or annotate as a developer. Select something on the page, leave a
				note, and export your changes. Drafts stay in this browser.
			</p>
		</div>
		<Button href="/docs/tools/page-annotations" variant="outline" class="shrink-0"
			>About Page annotations</Button
		>
	</aside>
	<p role="status" class="mt-3 text-sm text-muted-foreground">
		{visible.length}
		{visible.length === 1 ? 'template' : 'templates'}
	</p>
	<div class="mt-6 grid gap-8 xl:grid-cols-2">
		{#each visible as template (template.slug)}
			<Card.Root
				role="article"
				id={template.slug}
				tabindex={-1}
				class="template-card block scroll-mt-20 gap-0 p-0 outline-none target:ring-2 target:ring-ring target:ring-offset-4 target:ring-offset-background"
			>
				<a
					href={`/templates/${template.slug}`}
					class="group block rounded-t-xl corner-theme focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
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
					<div class="mt-5 flex flex-wrap gap-2">
						<Button
							href={`/templates/${template.slug}?feedback=review`}
							variant="outline"
							size="sm"
							aria-label={`Review ${template.title}`}>Review template</Button
						>
						<Button
							href={`/templates/${template.slug}?feedback=developer`}
							variant="ghost"
							size="sm"
							aria-label={`Annotate ${template.title}`}>Annotate template</Button
						>
					</div>
					<details class="mt-5 text-sm">
						<summary
							class="cursor-pointer rounded py-1 font-medium corner-theme focus-visible:outline-2 focus-visible:outline-ring"
							>Built with Bedrock</summary
						>
						<p class="mt-2 leading-relaxed text-muted-foreground">
							{template.components.join(', ')}. {template.blocks.length
								? `Blocks: ${template.blocks.join(', ')}.`
								: 'Composed directly from public components.'}
						</p>
					</details>
				</div>
			</Card.Root>
		{:else}
			<p class="rounded-xl border border-dashed p-8 text-muted-foreground corner-theme">
				No templates match “{query}”. Try “music”, “video”, “email”, or “social”.
			</p>
		{/each}
	</div>
</article>
