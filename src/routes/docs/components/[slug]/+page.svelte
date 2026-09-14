<script lang="ts">
	import BoxIcon from '@lucide/svelte/icons/box';
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Button } from '#lib/bedrock/ui/button';
	import * as Card from '#lib/bedrock/ui/card';
	import * as Empty from '#lib/bedrock/ui/empty';
	import { Heading } from '#lib/bedrock/ui/heading';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { Outline, type OutlineItem } from '#lib/bedrock/ui/outline';
	import { Text } from '#lib/bedrock/ui/text';
	import CodeBlock from '#lib/site/CodeBlock.svelte';
	import { getExample } from '#lib/site/examples';
	import { importPath } from '#lib/site/registry';

	let { data } = $props();
	let sourceOpen = $state(false);

	// SvelteKit can update leaf props before destroying this component when a
	// navigation leaves the dynamic route. Keep teardown/HMR from dereferencing
	// another page's data shape.
	let component = $derived(data.component as typeof data.component | undefined);
	let slug = $derived(component?.slug ?? '');
	let examplePromise = $derived(slug ? getExample(slug) : Promise.resolve(undefined));
	let guide = $derived(component ? data.guide : undefined);
	let path = $derived(slug ? importPath(slug) : '');
	let exportName = $derived(
		component?.importName ?? component?.title.replaceAll(' ', '') ?? 'Component'
	);
	let isCompound = $derived((guide?.anatomy.length ?? 0) > 1);
	let importCode = $derived(
		isCompound
			? `import * as ${exportName} from '${path}';`
			: `import { ${exportName} } from '${path}';`
	);
	let outlineItems = $derived.by<OutlineItem[]>(() => {
		const items: OutlineItem[] = [
			{ id: 'installation', label: 'Installation', level: 2 },
			{ id: 'usage', label: 'Usage', level: 2 },
			{ id: 'what-it-is', label: 'What it is', level: 3 },
			{ id: 'anatomy', label: 'Anatomy', level: 3 }
		];
		if (guide?.behavior?.length) items.push({ id: 'behavior', label: 'Behavior', level: 3 });
		items.push({ id: 'examples', label: 'Examples', level: 2 });
		return items;
	});
</script>

<svelte:head>
	<title>{component?.title ?? 'Components'} — Bedrock</title>
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

				<section id="installation" aria-labelledby="installation-heading" class="space-y-4">
					<Heading id="installation-heading" level={2}>Installation</Heading>
					<CodeBlock label="TypeScript" language="typescript" code={importCode} />
					{#if isCompound}
						<Text color="muted" as="p" class="leading-relaxed">
							Use a namespace import to keep the family together. Usage stays discoverable as
							<code class="font-code text-foreground">{guide?.anatomy[0]?.name}</code> in TypeScript autocomplete.
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
								<ul class="grid gap-3 text-sm leading-relaxed text-muted-foreground md:grid-cols-2">
									{#each guide.behavior as item, index (item)}
										<li class="rounded-lg border bg-muted/20 p-4">
											<span class="me-2 font-code text-xs text-foreground/60">{index + 1}.</span
											>{item}
										</li>
									{/each}
								</ul>
							</section>
						{/if}
					{/if}
				</section>

				<section id="examples" aria-labelledby="examples-heading" class="space-y-6">
					<Heading id="examples-heading" level={2}>Examples</Heading>

					<section aria-labelledby="live-example-heading" class="space-y-4">
						<div class="max-w-3xl space-y-2">
							<Heading id="live-example-heading" level={3} visual={4}>Default example</Heading>
							<Text color="muted" as="p" class="leading-relaxed">
								A working starting point using the public Bedrock API.
							</Text>
						</div>

						<div class="overflow-hidden rounded-xl border bg-card">
							<div class="border-b bg-muted/40 px-4 py-2">
								<Text type="supporting" class="font-code tracking-wide uppercase">Preview</Text>
							</div>
							<div class="p-6 md:p-8">
								{#await examplePromise}
									<div
										class="h-32 animate-pulse rounded-lg bg-muted"
										aria-label="Loading example"
									></div>
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
							</div>
						</div>

						<div class="space-y-3">
							<Button
								id={`example-source-trigger-${slug}`}
								variant="outline"
								size="sm"
								aria-expanded={sourceOpen}
								aria-controls={`example-source-content-${slug}`}
								onclick={() => (sourceOpen = !sourceOpen)}
							>
								{sourceOpen ? 'Hide code' : 'View code'}
								<Icon icon={sourceOpen ? 'chevronUp' : 'chevronDown'} />
							</Button>
							{#if sourceOpen}
								<div id={`example-source-content-${slug}`}>
									{#await examplePromise then example}
										{#if example}
											<CodeBlock
												label={`${component.title} example`}
												language="svelte"
												code={example.source}
												lineNumbers
												maxHeight="32rem"
											/>
										{/if}
									{/await}
								</div>
							{/if}
						</div>
					</section>
				</section>
			</article>

			<aside class="sticky top-20 hidden xl:block">
				<Text type="supporting" as="p" class="mb-3 font-medium text-foreground">On this page</Text>
				<Outline items={outlineItems} offset={72} label={`${component.title} sections`} />
			</aside>
		</div>
	{/key}
{/if}
