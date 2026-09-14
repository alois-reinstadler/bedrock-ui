<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { Badge } from '#lib/bedrock/ui/badge';
	import * as Card from '#lib/bedrock/ui/card';
	import CodeBlock from '#lib/site/CodeBlock.svelte';
	import DocsPageHeader from '#lib/site/DocsPageHeader.svelte';

	const installCode = `mkdir -p "\${CODEX_HOME:-$HOME/.codex}/skills"
cp -R skills/bedrock-ui "\${CODEX_HOME:-$HOME/.codex}/skills/bedrock-ui"`;
	const promptCode = `Use $bedrock-ui to build an account settings view.
Reuse public Bedrock components and document any new product pattern.`;
</script>

<svelte:head
	><title>Bedrock skill — Bedrock</title><meta
		name="description"
		content="Give a coding agent Bedrock-specific component and accessibility guidance."
	/></svelte:head
>

<article class="mx-auto max-w-4xl px-4 py-10 md:px-8">
	<div class="flex items-start justify-between gap-6">
		<DocsPageHeader
			title="Bedrock UI skill"
			description="A repository-aware coding-agent skill that turns Bedrock's API, ownership, motion, and verification conventions into reusable project guidance."
		/><Badge variant="outline">Included in repo</Badge>
	</div>
	<section class="mt-12" aria-labelledby="install-skill-heading">
		<h2 id="install-skill-heading" class="text-2xl font-medium tracking-tight">Installation</h2>
		<p class="mt-2 mb-5 text-muted-foreground">
			Copy the checked-in skill into your agent's skill directory, or reference it directly from
			this repository.
		</p>
		<CodeBlock label="Shell" language="bash" code={installCode} />
		<p class="mt-3 text-sm text-muted-foreground">
			<code>-p</code> creates missing parent directories; <code>-R</code> copies the complete skill directory
			recursively. CODEX_HOME uses your configured location, with ~/.codex as fallback.
		</p>
		<Button href="/docs/skills/bedrock-ui.md" download="SKILL.md" variant="outline" class="mt-4"
			>Download SKILL.md</Button
		>
	</section>
	<section class="mt-14" aria-labelledby="activation-heading">
		<h2 id="activation-heading" class="text-2xl font-medium tracking-tight">Activation</h2>
		<p class="mt-2 mb-5 text-muted-foreground">
			It activates for implementation or review work that should use Bedrock UI. Name it explicitly
			when Bedrock compliance is central to the request.
		</p>
		<CodeBlock label="Prompt" language="text" code={promptCode} />
	</section>
	<section class="mt-14 grid gap-5 md:grid-cols-3" aria-label="Skill scope">
		<Card.Root
			><Card.Header
				><Card.Title>Discover</Card.Title><Card.Description
					>Inspect the registry and public wrapper APIs before adding another primitive.</Card.Description
				></Card.Header
			></Card.Root
		>
		<Card.Root
			><Card.Header
				><Card.Title>Compose</Card.Title><Card.Description
					>Prefer components, then blocks, then templates according to the size of the product
					problem.</Card.Description
				></Card.Header
			></Card.Root
		>
		<Card.Root
			><Card.Header
				><Card.Title>Verify</Card.Title><Card.Description
					>Run type, unit, browser, console, keyboard, and reduced-motion checks proportional to the
					change.</Card.Description
				></Card.Header
			></Card.Root
		>
	</section>
</article>
