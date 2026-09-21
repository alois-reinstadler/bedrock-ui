<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import CodeBlock from '#lib/site/CodeBlock.svelte';
	import DocsPageHeader from '#lib/site/DocsPageHeader.svelte';

	const tokenCode = `:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --radius: 0.625rem;
  --corner-shape: squircle;
}`;
	const cornerCode = `:root {
  --corner-shape: squircle; /* round, bevel, or superellipse(1.5) */
}

/* Override a section without changing component props. */
.rounded-section {
  --corner-shape: round;
}`;
</script>

<svelte:head
	><title>Theming — Bedrock</title><meta
		name="description"
		content="Customize Bedrock color, type, radius, corner shape, and motion tokens."
	/></svelte:head
>

<article class="mx-auto max-w-4xl px-4 py-10 md:px-8">
	<DocsPageHeader
		title="Theming"
		description="Bedrock separates semantic intent from rendered values. Change a compact token layer; keep component markup and imports stable."
	/>
	<section class="mt-12" aria-labelledby="tokens-heading">
		<h2 id="tokens-heading" class="text-2xl font-medium tracking-tight">Semantic tokens</h2>
		<p class="mt-2 mb-5 max-w-2xl text-muted-foreground">
			Components consume roles such as background, foreground, primary, muted, destructive, and
			ring. Keep those roles meaningful in every theme.
		</p>
		<CodeBlock label="CSS" language="css" code={tokenCode} />
	</section>
	<section class="mt-14" aria-labelledby="corners-heading">
		<h2 id="corners-heading" class="text-2xl font-medium tracking-tight">Corner shape</h2>
		<p class="mt-2 mb-5 max-w-2xl text-muted-foreground">
			<code>--radius</code> sets the corner size; <code>--corner-shape</code> sets its curve.
			Buttons, cards, inputs, menus and other shared component surfaces use the same shape. The
			default is <code>squircle</code>. Browsers without CSS corner-shape support keep the existing
			rounded corners.
		</p>
		<CodeBlock label="CSS" language="css" code={cornerCode} />
		<p class="mt-4 max-w-2xl text-sm text-muted-foreground">
			Use <code>corner-theme</code> with a radius utility on custom surfaces. Use
			<code>corner-round</code> for an intentional exception; <code>rounded-full</code> keeps circles
			and pills round. Root overrides reach portaled menus and dialogs too; a local override follows the
			DOM subtree containing the surface.
		</p>
	</section>
	<section class="mt-14 grid gap-5 md:grid-cols-2" aria-label="Theme guidance">
		<Card.Root
			><Card.Header
				><Card.Title>Light and dark</Card.Title><Card.Description
					>Define both modes together. A color that works in isolation can fail when overlays, hover
					layers, or nested surfaces are composited.</Card.Description
				></Card.Header
			></Card.Root
		>
		<Card.Root
			><Card.Header
				><Card.Title>Contrast</Card.Title><Card.Description
					>Verify text, essential icons, control boundaries, and focus indicators in their final
					rendered states against WCAG 2.2 AA.</Card.Description
				></Card.Header
			></Card.Root
		>
		<Card.Root
			><Card.Header
				><Card.Title>Radius and type</Card.Title><Card.Description
					>Change the root radius and font families, then inspect dense controls and nested cards
					before changing individual components.</Card.Description
				></Card.Header
			></Card.Root
		>
		<Card.Root
			><Card.Header
				><Card.Title>Motion</Card.Title><Card.Description
					>Use Bedrock motion tokens for state, press, reveal, overlay, and exit behavior. Preserve
					reduced-motion behavior and avoid one-off durations.</Card.Description
				></Card.Header
			></Card.Root
		>
	</section>
	<section class="mt-14" aria-labelledby="boundary-heading">
		<h2 id="boundary-heading" class="text-2xl font-medium tracking-tight">
			Customization boundary
		</h2>
		<ul class="mt-4 space-y-3 text-sm text-muted-foreground">
			<li class="rounded-xl border p-4 corner-theme">
				<strong class="text-foreground">Start with tokens.</strong> They preserve consistent intent across
				every component.
			</li>
			<li class="rounded-xl border p-4 corner-theme">
				<strong class="text-foreground">Extend Bedrock wrappers next.</strong> Keep app imports
				pointed at <code>#lib/bedrock</code>.
			</li>
			<li class="rounded-xl border p-4 corner-theme">
				<strong class="text-foreground">Fork a component deliberately.</strong> Document any changed keyboard,
				focus, or accessibility contract.
			</li>
		</ul>
	</section>
</article>
