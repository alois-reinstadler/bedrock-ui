<script lang="ts">
	import { CssButton, CssPanel } from '#lib/bedrock/motion/css.js';
	import { Motion, MotionConfig } from '#lib/bedrock/motion/engine.js';
	let cssVisible = $state(true);
	let engineVisible = $state(true);
	let pressed = $state(0);
	let reduced = $state(false);
	let move = $state(false);
</script>

<svelte:head
	><title>Opt-in motion — Bedrock</title><meta
		name="description"
		content="The same Astra Motion API, with opt-in CSS or spring animation in Bedrock UI."
	/></svelte:head
>

<MotionConfig reducedMotion={reduced ? 'always' : 'user'}>
	<main class="mx-auto max-w-5xl px-6 py-16">
		<nav aria-label="Motion navigation" class="mb-8 flex gap-4 text-sm">
			<a href="/" class="underline underline-offset-4">Bedrock UI</a>
			<a href="/docs/motion" class="underline underline-offset-4">Motion guide</a>
		</nav>
		<p class="mb-3 text-sm text-muted-foreground">BEDROCK / MOTION</p>
		<h1 class="mb-5 text-4xl font-semibold tracking-tight">One API. Choose the movement.</h1>
		<p class="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
			CSS for finite feedback and simple transitions. The Motion engine for springs and richer
			interactions. These components are explicit opt-ins; ordinary Bedrock primitives keep their
			existing behavior.
		</p>
		<label class="mb-8 flex items-center gap-2"
			><input data-testid="bedrock-motion-reduced" type="checkbox" bind:checked={reduced} /> Reduce motion</label
		>
		<div class="grid gap-6 md:grid-cols-2">
			<section class="rounded-xl border p-6">
				<h2 class="mb-3 text-xl font-semibold">CSS backend</h2>
				<p class="mb-5 text-sm leading-relaxed text-muted-foreground">
					Existing initial, animate, exit and transition options. Durations are in seconds.
				</p>
				<div class="mb-5 flex flex-wrap gap-2">
					<CssButton
						data-testid="bedrock-css-toggle"
						onclick={() => (cssVisible = !cssVisible)}
						aria-controls="css-motion-panel"
						aria-expanded={cssVisible}>Toggle CSS panel</CssButton
					>
					<CssButton
						variant="outline"
						data-testid="bedrock-css-retarget"
						onclick={() => (move = !move)}>Retarget</CssButton
					>
				</div>
				<div class="min-h-36 overflow-clip">
					{#if cssVisible}
						<CssPanel
							id="css-motion-panel"
							data-testid="bedrock-css-panel"
							class="rounded-lg bg-muted p-5"
							motion={{
								initial: { opacity: 0, y: 12 },
								animate: { opacity: 1, y: 0, x: move ? 32 : 0 },
								exit: { opacity: 0, y: -12 },
								transition: { duration: 0.22, ease: 'easeOut' },
								reducedMotion: reduced ? 'always' : 'user'
							}}
						>
							<p class="mb-3 font-medium">A native Bedrock surface</p>
							<CssButton
								data-testid="bedrock-native-action"
								variant="outline"
								onclick={() => pressed++}>Pressed {pressed} times</CssButton
							>
						</CssPanel>
					{/if}
				</div>
			</section>
			<section class="rounded-xl border p-6">
				<h2 class="mb-3 text-xl font-semibold">Motion backend</h2>
				<p class="mb-5 text-sm leading-relaxed text-muted-foreground">
					Keep the engine when spring physics and interrupted velocity matter.
				</p>
				<CssButton
					data-testid="bedrock-engine-toggle"
					class="mb-5"
					onclick={() => (engineVisible = !engineVisible)}
					aria-controls="spring-motion-panel"
					aria-expanded={engineVisible}>Toggle spring panel</CssButton
				>
				<div class="min-h-36">
					{#if engineVisible}
						<Motion
							id="spring-motion-panel"
							data-testid="bedrock-engine-panel"
							class="rounded-lg bg-muted p-5"
							motion={{
								initial: { opacity: 0, y: 24, scale: 0.95 },
								animate: { opacity: 1, y: 0, scale: 1 },
								exit: { opacity: 0, y: -16, scale: 0.95 },
								transition: { type: 'spring', stiffness: 380, damping: 28 },
								reducedMotion: reduced ? 'always' : 'user'
							}}>The original engine, with its existing API.</Motion
						>
					{/if}
				</div>
			</section>
		</div>
		<p class="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
			Native onclick owns button activation for pointer, Enter and Space. Use a separate surface
			when another primitive owns positioning transforms. CSS deliberately rejects springs, drag,
			keyframe arrays, dynamic variants, layout projection and per-frame callbacks. CSS-only
			applications should import the separate css entry; this comparison page intentionally imports
			both backends.
		</p>
	</main>
</MotionConfig>
