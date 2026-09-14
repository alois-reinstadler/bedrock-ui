<script lang="ts">
	import { Heading } from '#lib/bedrock/ui/heading';
	import { Text } from '#lib/bedrock/ui/text';
	import type { ComponentGuide, ComponentReference } from '#lib/site/component-guides/index.js';
	import type { ComponentDoc } from '#lib/site/registry';
	import ApiTable from './ApiTable.svelte';
	import ButtonPropertiesDemo from './ButtonPropertiesDemo.svelte';

	let {
		component,
		guide,
		reference
	}: { component: ComponentDoc; guide: ComponentGuide; reference: ComponentReference } = $props();

	let grouped = $derived.by(() => {
		const properties = reference.api.filter(
			(entry) => entry.kind === 'prop' || entry.kind === 'bindable'
		);
		const composition = reference.api.filter(
			(entry) => entry.kind !== 'prop' && entry.kind !== 'bindable'
		);
		return [
			['Properties and bindings', properties],
			['Composition', composition]
		] as const;
	});
</script>

<div class="space-y-12" data-doc-tab="properties">
	<section id="api" aria-labelledby="api-heading" class="space-y-4">
		<Heading id="api-heading" level={2}>Public API</Heading>
		<Text color="muted" as="p" class="max-w-3xl leading-relaxed">
			The supported surface for {component.title}. Types are extracted at build time from the public
			exports and their installed primitive contracts. Defaults are read from source initializers. A
			dash means no explicit wrapper default.
		</Text>
	</section>

	{#if component.slug === 'button'}
		<section id="property-demo" aria-labelledby="property-demo-heading" class="space-y-4">
			<div class="space-y-2">
				<Heading id="property-demo-heading" level={3} visual={4}>Property playground</Heading>
				<Text color="muted" as="p">
					Compare variant, size, and disabled state without changing button semantics.
				</Text>
			</div>
			<ButtonPropertiesDemo />
		</section>
	{/if}

	{#each grouped as [title, entries], index (title)}
		{#if entries?.length}
			<section
				id={index === 0 ? 'properties' : 'composition'}
				aria-labelledby={`api-group-${index}`}
				class="space-y-4"
			>
				<Heading id={`api-group-${index}`} level={3} visual={4}>{title}</Heading>
				<ApiTable {entries} />
			</section>
		{/if}
	{/each}

	<section id="parts" aria-labelledby="parts-heading" class="space-y-4">
		<Heading id="parts-heading" level={3} visual={4}>Component parts</Heading>
		<Text color="muted" as="p" class="max-w-3xl leading-relaxed">
			Aliases below resolve to the same component. Compose parts according to the anatomy
			relationships; native attribute forwarding depends on each part’s source type.
		</Text>
		<dl class="divide-y overflow-hidden rounded-xl border bg-card">
			{#each guide.anatomy as part (part.name)}
				<div class="grid gap-2 p-4 md:grid-cols-[minmax(12rem,0.7fr)_1.3fr] md:gap-6 md:p-5">
					<dt><code class="font-code text-sm font-medium">{part.name}</code></dt>
					<dd class="text-sm leading-relaxed text-muted-foreground">{part.description}</dd>
				</div>
			{/each}
		</dl>
	</section>
	{#each reference.parts ?? [] as part (part.name)}
		<section class="space-y-4" aria-label={`${part.name} reference`}>
			<Heading level={3} visual={4}>{part.name}</Heading>
			{#if part.aliases.length}<Text as="p" color="muted">Aliases: {part.aliases.join(', ')}</Text
				>{/if}
			<Text as="p" color="muted" class="break-all">Source: <code>{part.source}</code></Text>
			{#if part.entries.length && part.name !== reference.parts?.[0]?.name}<ApiTable
					entries={part.entries}
				/>{/if}
			<Text as="p" color="muted">{part.inherited}</Text>
			<a
				class="text-sm underline underline-offset-4"
				href="https://svelte.dev/docs/svelte/typescript#Typing-wrapper-components"
				>Svelte native element typing</a
			>
		</section>
	{/each}
</div>
