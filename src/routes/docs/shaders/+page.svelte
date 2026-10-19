<script lang="ts">
	import { ClickableCard } from '#lib/bedrock/ui/clickable-card';
	import { Shader } from '#lib/bedrock/shaders/index.js';
	import { shaders, shaderSampleImage, type ShaderCategory } from '#lib/bedrock/shaders/catalog.js';
	import { Button } from '#lib/bedrock/ui/button';
	import { Input } from '#lib/bedrock/ui/input';
	import DocsPageHeader from '#lib/site/DocsPageHeader.svelte';
	let category = $state<ShaderCategory | 'All'>('All');
	let query = $state('');
	let paused = $state(false);
	const categories = ['All', 'Backgrounds', 'Text', 'Images'] as const;
	let filtered = $derived(
		shaders.filter(
			(shader) =>
				(category === 'All' || shader.category === category) &&
				`${shader.title} ${shader.description}`.toLowerCase().includes(query.toLowerCase().trim())
		)
	);
</script>

<svelte:head
	><title>Shaders — Bedrock</title><meta
		name="description"
		content="Explore twelve Paper shaders for backgrounds, expressive typography, and image effects. Live Svelte previews with editable text and image uploads."
	/></svelte:head
>

<article class="mx-auto max-w-6xl px-4 py-10 md:px-8">
	<DocsPageHeader
		eyebrow="Shader collection"
		title="A little less ordinary."
		description="Light, texture, and movement for your next interface. Explore real Paper shaders for atmospheric backgrounds, expressive type, and images with a different point of view."
	/>
	<div class="mt-8 flex flex-wrap items-center justify-between gap-4 border-b pb-5">
		<div class="flex flex-wrap gap-1" aria-label="Shader categories">
			{#each categories as item (item)}<Button
					size="sm"
					variant={category === item ? 'secondary' : 'ghost'}
					aria-pressed={category === item}
					onclick={() => (category = item)}
					>{item}<span class="ml-1 text-xs text-muted-foreground"
						>{item === 'All'
							? shaders.length
							: shaders.filter((shader) => shader.category === item).length}</span
					></Button
				>{/each}
		</div>
		<div class="flex items-center gap-2">
			<Input
				aria-label="Search shaders"
				placeholder="Find an effect…"
				bind:value={query}
				class="w-44"
			/><Button variant="outline" size="sm" aria-pressed={paused} onclick={() => (paused = !paused)}
				>{paused ? 'Play previews' : 'Pause previews'}</Button
			>
		</div>
	</div>
	<p class="mt-5 text-xs text-muted-foreground" role="status">
		{filtered.length}
		{filtered.length === 1 ? 'shader' : 'shaders'} · Original Paper programs · Svelte components
	</p>
	<div class="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
		{#each filtered as shader (shader.slug)}
			<ClickableCard
				href={`/docs/shaders/${shader.slug}`}
				class="group gap-0 p-0"
				label={`Explore ${shader.title}`}
			>
				<Shader
					effect={shader.slug}
					text={shader.category === 'Text'
						? shader.slug === 'liquid-metal'
							? 'Melt.'
							: 'Glow.'
						: undefined}
					src={shader.category === 'Images' ? shaderSampleImage : undefined}
					alt="Green mountain ridges beneath mist and sunset clouds"
					{paused}
					maxPixelCount={300000}
					showStatus
					class="aspect-[4/3]"
				>
					{#if shader.category === 'Backgrounds'}<div class="flex aspect-[4/3] items-end p-6">
							<span class="text-3xl font-semibold tracking-tighter text-white drop-shadow-lg"
								>{shader.slug === 'god-rays'
									? 'After hours.'
									: shader.slug === 'mesh-gradient'
										? 'Made to move.'
										: 'Stay curious.'}</span
							>
						</div>{/if}
				</Shader>
				<div class="p-5">
					<div class="flex items-center justify-between gap-2">
						<h2 class="font-medium">{shader.title}</h2>
						<span class="font-mono text-[10px] tracking-wider text-muted-foreground uppercase"
							>{shader.category}</span
						>
					</div>
					<p class="mt-2 text-sm leading-relaxed text-muted-foreground">{shader.description}</p>
				</div>
			</ClickableCard>
		{:else}<p class="col-span-full py-12 text-center text-muted-foreground">
				No shaders match. Try another search or category.
			</p>{/each}
	</div>
	<p class="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground">
		Powered by <a
			class="underline underline-offset-4"
			href="https://shaders.paper.design/"
			target="_blank"
			rel="noreferrer">Paper Shaders</a
		>. Open an effect to edit its settings, try your own text or image, and copy the Svelte example.
		Animations respect reduced motion.
	</p>
</article>
