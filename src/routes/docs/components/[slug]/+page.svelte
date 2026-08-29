<script lang="ts">
	import BoxIcon from '@lucide/svelte/icons/box';
	import * as Empty from '#lib/bedrock/ui/empty';
	import CodeBlock from '#lib/site/CodeBlock.svelte';
	import { getExample } from '#lib/site/examples';
	import { importPath } from '#lib/site/registry';

	let { data } = $props();

	let Example = $derived(getExample(data.component.slug));
	let path = $derived(importPath(data.component.slug));
	let exportName = $derived(data.component.title.replaceAll(' ', ''));
</script>

<svelte:head>
	<title>{data.component.title} — Bedrock</title>
	<meta name="description" content={data.component.description} />
</svelte:head>

<article class="mx-auto max-w-3xl px-4 py-10 md:px-8">
	<p class="font-mono text-xs tracking-wide text-muted-foreground uppercase">
		{data.component.category}
	</p>
	<h1 class="mt-2 text-3xl font-medium tracking-tight">{data.component.title}</h1>
	<p class="mt-3 max-w-[62ch] text-base leading-relaxed text-muted-foreground">
		{data.component.description}
	</p>

	<div class="mt-8 overflow-hidden rounded-xl ring-1 ring-foreground/10">
		<div class="border-b bg-muted/40 px-4 py-2">
			<p class="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">Preview</p>
		</div>
		<div class="bg-card p-6">
			{#if Example}
				<Example />
			{:else}
				<Empty.Root class="border-0 p-2">
					<Empty.Header>
						<Empty.Media variant="icon">
							<BoxIcon />
						</Empty.Media>
						<Empty.Title>Preview not wired yet</Empty.Title>
						<Empty.Description>
							The source is ready to import. A live example for this primitive is next.
						</Empty.Description>
					</Empty.Header>
				</Empty.Root>
			{/if}
		</div>
	</div>

	<div class="mt-8 space-y-3">
		<h2 class="text-lg font-medium tracking-tight">Import</h2>
		<CodeBlock label="TypeScript" code={`import { ${exportName} } from '${path}';`} />
		<p class="text-sm text-muted-foreground">
			Compound components also export named parts from the same module. Prefer
			<code class="font-mono text-foreground">import * as {exportName} from '{path}'</code>
			when you need Root, Trigger, and Content together.
		</p>
	</div>
</article>
