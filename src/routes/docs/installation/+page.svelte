<script lang="ts">
	import CodeBlock from '#lib/site/CodeBlock.svelte';

	const buttonExample = [
		'<script lang="ts">',
		"  import { Button } from '#lib/bedrock/ui/button';",
		'<' + '/script>',
		'',
		'<Button>Save</Button>'
	].join('\n');
</script>

<svelte:head>
	<title>Installation — Bedrock</title>
	<meta name="description" content="How Bedrock is wired in this SvelteKit app." />
</svelte:head>

<article class="mx-auto max-w-3xl px-4 py-10 md:px-8">
	<p class="font-mono text-xs tracking-wide text-muted-foreground uppercase">Docs</p>
	<h1 class="mt-2 text-3xl font-medium tracking-tight">Installation</h1>
	<p class="mt-4 max-w-[62ch] text-base leading-relaxed text-muted-foreground">
		There is nothing to add. Bedrock ships as source in this repository. Use it from the
		<code class="font-mono text-foreground">#lib/bedrock</code> alias.
	</p>

	<ol class="mt-8 space-y-8">
		<li>
			<p class="text-sm font-medium">1. Import a component</p>
			<p class="mt-1 mb-3 text-sm text-muted-foreground">
				Point at the Bedrock entry, not the generated shadcn folder.
			</p>
			<CodeBlock label="Svelte" language="svelte" code={buttonExample} />
		</li>
		<li>
			<p class="text-sm font-medium">2. Tokens are already loaded</p>
			<p class="mt-1 text-sm leading-relaxed text-muted-foreground">
				<code class="font-mono text-foreground">src/routes/layout.css</code> defines the color,
				radius, and type scale. Instrument Sans is the UI font. Dark mode is the
				<code class="font-mono text-foreground">.dark</code> class, toggled by mode-watcher.
			</p>
		</li>
		<li>
			<p class="text-sm font-medium">3. Change the source</p>
			<p class="mt-1 text-sm leading-relaxed text-muted-foreground">
				Edit files under <code class="font-mono text-foreground">src/lib/bedrock</code> and preserve the
				frozen shadcn source. App imports stay stable.
			</p>
		</li>
	</ol>
</article>
