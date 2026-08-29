<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '#lib/bedrock/ui/button';
	import CodeBlock from '#lib/site/CodeBlock.svelte';
	import { components } from '#lib/site/registry';
</script>

<svelte:head>
	<title>Introduction — Bedrock</title>
	<meta name="description" content="What Bedrock is and how to import the components." />
</svelte:head>

<article class="mx-auto max-w-3xl px-4 py-10 md:px-8">
	<p class="font-mono text-xs tracking-wide text-muted-foreground uppercase">Docs</p>
	<h1 class="mt-2 text-3xl font-medium tracking-tight">A kit that stays in the repo.</h1>
	<p class="mt-4 max-w-[62ch] text-base leading-relaxed text-muted-foreground">
		Bedrock is the in-tree UI for this project. Each primitive is a Svelte 5 component under
		<code class="font-mono text-foreground">src/lib/bedrock</code>. You do not install a UI package to
		use a button — you import the file.
	</p>

	<div class="mt-8 space-y-3">
		<h2 class="text-lg font-medium tracking-tight">Import</h2>
		<CodeBlock
			label="Svelte"
			code={`import { Button } from '#lib/bedrock/ui/button';
import * as Dialog from '#lib/bedrock/ui/dialog';`}
		/>
	</div>

	<div class="mt-10 grid gap-6 sm:grid-cols-2">
		<div class="rounded-xl p-4 ring-1 ring-foreground/10">
			<p class="text-sm font-medium">Installation</p>
			<p class="mt-1 text-sm text-muted-foreground">
				The kit is already in this app. Tokens live in the root layout CSS.
			</p>
			<Button href={resolve('/docs/installation')} variant="outline" size="sm" class="mt-4">
				Open installation
			</Button>
		</div>
		<div class="rounded-xl p-4 ring-1 ring-foreground/10">
			<p class="text-sm font-medium">{components.length} components</p>
			<p class="mt-1 text-sm text-muted-foreground">
				Buttons, overlays, forms, and layout primitives with live examples.
			</p>
			<Button href={resolve('/docs/components')} variant="outline" size="sm" class="mt-4">
				Browse the kit
			</Button>
		</div>
	</div>
</article>
