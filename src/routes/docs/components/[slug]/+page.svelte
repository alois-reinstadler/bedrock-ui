<script lang="ts">
	import { onMount } from 'svelte';
	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});
	import { page } from '$app/state';
	import BoxIcon from '@lucide/svelte/icons/box';
	import { Badge } from '#lib/bedrock/ui/badge';
	import * as Card from '#lib/bedrock/ui/card';
	import * as Empty from '#lib/bedrock/ui/empty';
	import { Heading } from '#lib/bedrock/ui/heading';
	import { Outline, type OutlineItem } from '#lib/bedrock/ui/outline';
	import { Text } from '#lib/bedrock/ui/text';
	import ExampleCard from '#lib/site/ExampleCard.svelte';
	import HighlightedCode from '#lib/site/HighlightedCode.svelte';
	import AccessibilityTab from '#lib/site/component-docs/AccessibilityTab.svelte';
	import ComponentTabs from '#lib/site/component-docs/ComponentTabs.svelte';
	import PropertiesTab from '#lib/site/component-docs/PropertiesTab.svelte';
	import type { ComponentDocTab } from '#lib/site/component-guides/index.js';
	import { getExample, getPreview } from '#lib/site/examples';

	let { data } = $props();

	// SvelteKit can update leaf props before destroying this component when a
	// navigation leaves the dynamic route. Keep teardown/HMR from dereferencing
	// another page's data shape.
	let component = $derived(data.component as typeof data.component | undefined);
	let slug = $derived(component?.slug ?? '');
	let guide = $derived(component ? data.guide : undefined);
	let reference = $derived(component ? data.reference : undefined);
	let requestedTab = $derived(mounted ? page.url.searchParams.get('tab') : null);
	let activeTab = $derived.by<ComponentDocTab>(() =>
		requestedTab === 'properties' || requestedTab === 'accessibility' ? requestedTab : 'overview'
	);
	let examplePromise = $derived(
		slug && activeTab === 'overview' ? getExample(slug) : Promise.resolve(undefined)
	);
	let isCompound = $derived((guide?.anatomy.length ?? 0) > 1);
	let previewPromise = $derived(
		slug && activeTab === 'overview' ? getPreview(slug) : Promise.resolve(undefined)
	);
	let bestPractices = $derived([
		...(guide?.behavior ?? []).slice(0, 3),
		...(guide?.avoidWhen ?? []).slice(0, 2)
	]);
	let outlineItems = $derived.by<OutlineItem[]>(() => {
		if (activeTab === 'properties') {
			const items: OutlineItem[] = [
				{ id: 'api', label: 'Public API', level: 2 },
				{ id: 'properties', label: 'Properties and bindings', level: 3 },
				{ id: 'composition', label: 'Composition', level: 3 },
				{ id: 'parts', label: 'Component parts', level: 3 }
			];
			if (component?.slug === 'button') {
				items.splice(3, 0, { id: 'property-demo', label: 'Property playground', level: 3 });
			}
			return items;
		}
		if (activeTab === 'accessibility') {
			const items: OutlineItem[] = [
				{ id: 'accessibility-overview', label: 'Accessibility contract', level: 2 },
				{ id: 'semantics', label: 'Semantics', level: 3 },
				{ id: 'keyboard', label: 'Keyboard interaction', level: 3 },
				{ id: 'focus', label: 'Focus management', level: 3 },
				{ id: 'labels', label: 'Labels and instructions', level: 3 },
				{ id: 'announcements', label: 'Announcements', level: 3 },
				{ id: 'reduced-motion', label: 'Reduced motion', level: 3 }
			];
			if (reference?.accessibility.requirements?.length) {
				items.push({
					id: 'color-contrast',
					label: component?.slug === 'button' ? 'Color contrast' : 'Requirements',
					level: 2
				});
			}
			items.push({ id: 'known-gaps', label: 'Known gaps', level: 2 });
			return items;
		}
		const items: OutlineItem[] = [
			{ id: 'preview', label: 'Common variants', level: 2 },
			{ id: 'installation', label: 'Installation', level: 2 },
			{ id: 'usage', label: 'Usage', level: 2 },
			{ id: 'what-it-is', label: 'What it is', level: 3 },
			{ id: 'anatomy', label: 'Anatomy', level: 3 }
		];
		if (guide?.behavior?.length) items.push({ id: 'behavior', label: 'Behavior', level: 3 });
		items.push({ id: 'best-practices', label: 'Best practices', level: 3 });
		items.push({ id: 'examples', label: 'Examples', level: 2 });
		return items;
	});
</script>

<svelte:head>
	<title
		>{component?.title ?? 'Components'}{activeTab === 'overview' ? '' : ` ${activeTab}`} — Bedrock</title
	>
	<meta name="description" content={component?.description ?? 'Bedrock component documentation'} />
</svelte:head>

{#if component}
	{#key component.slug}
		<div
			data-doc-slug={component.slug}
			class="mx-auto grid max-w-6xl items-start gap-12 px-4 py-10 md:px-8 md:py-14 xl:grid-cols-[minmax(0,1fr)_12rem]"
		>
			<article class="min-w-0 space-y-14">
				<header class="max-w-3xl">
					<Text type="supporting" as="p" class="font-code tracking-wide uppercase">
						{component.category}
					</Text>
					<Heading level={1} class="mt-2">{component.title}</Heading>
					<Text type="large" color="muted" as="p" class="mt-3 max-w-[62ch] leading-relaxed">
						{component.description}
					</Text>
				</header>

				<ComponentTabs {component} active={activeTab} />

				{#if activeTab === 'overview'}
					<section id="preview" aria-labelledby="preview-heading" class="space-y-4">
						<Heading id="preview-heading" level={2}>Common variants</Heading>
						<ExampleCard
							label={`${component.title} variants`}
							sourceUrl={`/docs/examples/previews/${slug}/source.json`}
						>
							{#await previewPromise}<p
									role="status"
									class="min-h-24 text-sm text-muted-foreground"
								>
									Loading variants…
								</p>
							{:then preview}{#if preview}{@const Preview = preview.component}<Preview />{/if}
							{:catch}<p role="status">
									Variants could not load. Reload the page to retry.
								</p>{/await}
						</ExampleCard>
					</section>
					<section id="installation" aria-labelledby="installation-heading" class="space-y-4">
						<Heading id="installation-heading" level={2}>Installation</Heading>
						<HighlightedCode code={data.importCode} html={data.importHtml} />
						{#if isCompound}
							<Text color="muted" as="p" class="leading-relaxed">
								Use a namespace import to keep the family together. Usage stays discoverable as
								<code class="font-code text-foreground">{guide?.anatomy[0]?.name}</code> in TypeScript
								autocomplete.
							</Text>
						{/if}
					</section>

					<section id="usage" aria-labelledby="usage-heading" class="space-y-10">
						<Heading id="usage-heading" level={2}>Usage</Heading>

						{#if guide}
							<section id="what-it-is" aria-labelledby="purpose-heading" class="space-y-4">
								<Heading id="purpose-heading" level={3} visual={4}>What it is</Heading>
								<Text type="large" as="p" class="max-w-3xl leading-relaxed">{guide.purpose}</Text>

								<div class="grid gap-4 pt-2 md:grid-cols-2">
									<Card.Root class="h-full border-primary/20 shadow-none">
										<Card.Header><Card.Title>When to use it</Card.Title></Card.Header>
										<Card.Content>
											<ul
												class="list-disc space-y-2 ps-5 text-sm leading-relaxed text-muted-foreground"
											>
												{#each guide.useWhen as item (item)}<li>{item}</li>{/each}
											</ul>
										</Card.Content>
									</Card.Root>

									<Card.Root class="h-full shadow-none">
										<Card.Header><Card.Title>When not to use it</Card.Title></Card.Header>
										<Card.Content>
											<ul
												class="list-disc space-y-2 ps-5 text-sm leading-relaxed text-muted-foreground"
											>
												{#each guide.avoidWhen as item (item)}<li>{item}</li>{/each}
											</ul>
										</Card.Content>
									</Card.Root>
								</div>
							</section>

							<section id="anatomy" aria-labelledby="anatomy-heading" class="space-y-4">
								<div class="max-w-3xl space-y-2">
									<Heading id="anatomy-heading" level={3} visual={4}>Anatomy</Heading>
									<Text color="muted" as="p" class="leading-relaxed">
										The public pieces of the component family and the role each one plays.
									</Text>
								</div>

								<dl class="divide-y overflow-hidden rounded-xl border bg-card">
									{#each guide.anatomy as part (part.name)}
										<div
											class="grid gap-2 p-4 md:grid-cols-[minmax(12rem,0.7fr)_1.3fr] md:gap-6 md:p-5"
										>
											<dt class="flex flex-wrap items-start gap-2">
												<code class="font-code text-sm font-medium break-all text-foreground">
													{part.name}
												</code>
												{#if part.required}<Badge variant="outline">Required</Badge>{/if}
											</dt>
											<dd class="text-sm leading-relaxed text-muted-foreground">
												{part.description}
											</dd>
										</div>
									{/each}
								</dl>
							</section>

							{#if guide.behavior?.length}
								<section id="behavior" aria-labelledby="behavior-heading" class="space-y-4">
									<Heading id="behavior-heading" level={3} visual={4}>Behavior</Heading>
									<ul
										class="grid gap-3 text-sm leading-relaxed text-muted-foreground md:grid-cols-2"
									>
										{#each guide.behavior as item, index (item)}
											<li class="rounded-lg border bg-muted/20 p-4">
												<span class="me-2 font-code text-xs text-foreground/60">{index + 1}.</span
												>{item}
											</li>
										{/each}
									</ul>
								</section>
							{/if}

							<section
								id="best-practices"
								aria-labelledby="best-practices-heading"
								class="space-y-4"
							>
								<Heading id="best-practices-heading" level={3} visual={4}>Best practices</Heading>
								<ul class="grid gap-3 text-sm leading-relaxed text-muted-foreground md:grid-cols-2">
									{#each bestPractices as item (item)}
										<li class="rounded-lg border bg-muted/20 p-4">{item}</li>
									{/each}
								</ul>
							</section>
						{/if}
					</section>

					<section id="examples" aria-labelledby="examples-heading" class="space-y-6">
						<Heading id="examples-heading" level={2}>Examples</Heading>

						<section aria-labelledby="live-example-heading" class="space-y-4">
							<div class="max-w-3xl space-y-2">
								<Heading id="live-example-heading" level={3} visual={4}>In practice</Heading>
								<Text color="muted" as="p" class="leading-relaxed">
									Use the component in a realistic product workflow, with supporting UI and
									meaningful state.
								</Text>
							</div>

							<ExampleCard
								label={`${component.title} example`}
								sourceUrl={`/docs/examples/examples/${slug}/source.json`}
							>
								{#await examplePromise}
									<div class="h-32 rounded-lg bg-muted" aria-label="Loading example"></div>
								{:then example}
									{#if example}
										{@const Example = example.component}
										<Example />
									{:else}
										<Empty.Root class="border-0 p-2">
											<Empty.Header>
												<Empty.Media variant="icon"><BoxIcon /></Empty.Media>
												<Empty.Title>Example in review</Empty.Title>
												<Empty.Description>
													The API is available; its primary example is still being reviewed.
												</Empty.Description>
											</Empty.Header>
										</Empty.Root>
									{/if}
								{:catch}
									<Empty.Root class="border-0 p-2">
										<Empty.Header>
											<Empty.Media variant="icon"><BoxIcon /></Empty.Media>
											<Empty.Title>Example failed to load</Empty.Title>
											<Empty.Description
												>Reload the page to retry this example chunk.</Empty.Description
											>
										</Empty.Header>
									</Empty.Root>
								{/await}
							</ExampleCard>
						</section>

						{#if slug === 'chat'}
							{#each [{ slug: 'chat-recovery', title: 'Message recovery and feedback', load: () => import('#lib/site/guide-examples/chat-recovery.svelte') }, { slug: 'chat-uploads', title: 'Upload progress and recovery', load: () => import('#lib/site/guide-examples/chat-uploads.svelte') }, { slug: 'chat-voice', title: 'Voice input', load: () => import('#lib/site/guide-examples/chat-voice.svelte') }, { slug: 'chat-context', title: 'Mentions and commands', load: () => import('#lib/site/guide-examples/chat-context.svelte') }, { slug: 'chat-sources', title: 'Citations and retrieved context', load: () => import('#lib/site/guide-examples/chat-sources.svelte') }, { slug: 'chat-decisions', title: 'Questions, approvals, and recommendations', load: () => import('#lib/site/guide-examples/chat-decisions.svelte') }, { slug: 'chat-workflow', title: 'Activity, change review, and selection actions', load: () => import('#lib/site/guide-examples/chat-workflow.svelte') }, { slug: 'chat-history', title: 'Empty states and conversation history', load: () => import('#lib/site/guide-examples/chat-history.svelte') }] as demo (demo.slug)}
								<section id={demo.slug} class="space-y-4" aria-label={demo.title}>
									<Heading level={3} visual={4}>{demo.title}</Heading>
									<ExampleCard
										label={demo.title}
										sourceUrl={`/docs/examples/guide-examples/${demo.slug}/source.json`}
									>
										{#await demo.load()}<p role="status">
												Loading example…
											</p>{:then module}<module.default />{:catch}<p role="alert">
												Example could not load. Reload the page to retry.
											</p>{/await}
									</ExampleCard>
								</section>
							{/each}
						{/if}
					</section>
				{:else if activeTab === 'properties' && guide && reference}
					<PropertiesTab {component} {guide} {reference} />
				{:else if activeTab === 'accessibility' && reference}
					<AccessibilityTab {component} accessibility={reference.accessibility} />
				{/if}
			</article>

			<aside class="sticky top-20 hidden xl:block">
				<Text type="supporting" as="p" class="mb-3 font-medium text-foreground">On this page</Text>
				<Outline items={outlineItems} offset={72} label={`${component.title} sections`} />
			</aside>
		</div>
	{/key}
{/if}
