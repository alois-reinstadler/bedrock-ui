<script lang="ts">
	import { resolve } from '$app/paths';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Button } from '#lib/bedrock/ui/button';
	import HeroPlayground from '#lib/site/HeroPlayground.svelte';
	import SiteHeader from '#lib/site/SiteHeader.svelte';
	import { components } from '#lib/site/registry';
</script>

<svelte:head>
	<title>Bedrock — Svelte 5 UI you copy into the repo</title>
	<meta
		name="description"
		content="Accessible Svelte 5 components owned as source. Import them from #lib/bedrock."
	/>
</svelte:head>

<div class="min-h-[100dvh] bg-background">
	<SiteHeader />
	<main>
		<section
			class="mx-auto grid max-w-[1400px] gap-12 px-4 py-16 md:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] md:items-center md:gap-16 md:px-8 md:py-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,32rem)]"
		>
			<div class="max-w-xl">
				<Badge variant="outline" class="mb-5">Svelte 5 · bits-ui · Tailwind 4</Badge>
				<h1 class="text-4xl leading-[0.95] font-medium tracking-tight text-foreground md:text-6xl">
					Copy the component.<br />Keep the control.
				</h1>
				<p class="mt-5 max-w-[42ch] text-base leading-relaxed text-muted-foreground">
					Bedrock is a Svelte 5 kit of accessible primitives. The files live in your repo. Import
					them from
					<code class="font-mono text-[0.9em] text-foreground">#lib/bedrock</code>.
				</p>
				<div class="mt-8 flex flex-wrap items-center gap-2">
					<Button href={resolve('/docs')} size="lg">
						Read the docs
						<ArrowRightIcon data-icon="inline-end" />
					</Button>
					<Button href={resolve('/docs/components')} variant="outline" size="lg">
						Browse components
					</Button>
				</div>
				<p class="mt-6 font-mono text-xs tracking-wide text-muted-foreground uppercase">
					{components.length} primitives · owned source · no package lock-in
				</p>
			</div>
			<HeroPlayground />
		</section>

		<section class="border-t">
			<div
				class="mx-auto grid max-w-[1400px] gap-10 px-4 py-16 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-16 md:px-8 md:py-20"
			>
				<div>
					<p class="font-mono text-xs tracking-wide text-muted-foreground uppercase">The kit</p>
					<h2 class="mt-2 text-2xl font-medium tracking-tight">
						Every control is a file you can open.
					</h2>
					<p class="mt-3 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
						No install step for the UI itself. Change a radius, a token, or a behavior in place.
					</p>
				</div>
				<div class="flex flex-wrap gap-2">
					{#each components as component (component.slug)}
						<Badge
							href={resolve('/docs/components/[slug]', { slug: component.slug })}
							variant="outline"
							class="rounded-lg px-2.5 py-1 text-[13px]"
						>
							{component.title}
						</Badge>
					{/each}
				</div>
			</div>
		</section>

		<section class="border-t">
			<div
				class="mx-auto grid max-w-[1400px] items-start gap-12 px-4 py-16 md:grid-cols-2 md:px-8 md:py-20"
			>
				<div class="md:sticky md:top-24">
					<p class="font-mono text-xs tracking-wide text-muted-foreground uppercase">Usage</p>
					<h2 class="mt-2 text-2xl font-medium tracking-tight">Import from the local alias.</h2>
					<p class="mt-3 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
						Bedrock wraps the generated primitives so app code always points at
						<code class="font-mono text-foreground">#lib/bedrock</code>. Restyle the source; the
						import stays put.
					</p>
				</div>
				<div class="space-y-6">
					<div class="overflow-hidden rounded-xl ring-1 ring-foreground/10">
						<pre class="overflow-x-auto bg-card p-5 text-[13px] leading-relaxed"><code
								>{`import { Button } from '#lib/bedrock/ui/button';
import * as Card from '#lib/bedrock/ui/card';`}</code
							></pre>
					</div>
					<ul class="divide-y text-sm">
						<li class="flex gap-4 py-3">
							<span class="w-24 shrink-0 font-mono text-xs text-muted-foreground">Accessible</span>
							<span class="text-foreground">Keyboard, focus, and ARIA come from bits-ui.</span>
						</li>
						<li class="flex gap-4 py-3">
							<span class="w-24 shrink-0 font-mono text-xs text-muted-foreground">Themed</span>
							<span class="text-foreground"
								>Neutral tokens, Instrument Sans, dark class via mode-watcher.</span
							>
						</li>
						<li class="flex gap-4 py-3">
							<span class="w-24 shrink-0 font-mono text-xs text-muted-foreground">Local</span>
							<span class="text-foreground"
								>Edit <code class="font-mono">src/lib/bedrock</code> the same way you edit a page.</span
							>
						</li>
					</ul>
				</div>
			</div>
		</section>
	</main>
	<footer class="border-t">
		<div
			class="mx-auto flex max-w-[1400px] flex-col gap-2 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8"
		>
			<p>Bedrock UI</p>
			<p>Svelte 5 components, kept in-tree.</p>
		</div>
	</footer>
</div>
