<script lang="ts">
	import { CssButton, CssPanel } from '#lib/bedrock/motion/css.js';
	import { Motion, MotionConfig } from '#lib/bedrock/motion/engine.js';
	import SiteHeader from '#lib/site/SiteHeader.svelte';
	import { CodeBlock } from '#lib/bedrock/ui/code-block';
	let cssVisible = $state(true);
	let engineVisible = $state(true);
	let pressed = $state(0);
	let reduced = $state(false);
	let move = $state(false);
	let duration = $state(0.22);
	const cssExample = `<script>
import { Motion } from '#lib/bedrock/motion/index.js';
<${'/'}script>

<Motion motion={{
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.22 }
}}>Ready when you are.</Motion>`;
	const springExample = `<script>
import { Motion } from '#lib/bedrock/motion/engine.js';
<${'/'}script>

<Motion motion={{
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: {
    type: 'spring', stiffness: 380, damping: 28
  }
}}>A spring that can change its mind.</Motion>`;
</script>

<svelte:head
	><title>Astra motion — Bedrock</title><meta
		name="description"
		content="Try CSS-first feedback and spring motion in the Bedrock motion workbench."
	/></svelte:head
>

<SiteHeader />

<MotionConfig reducedMotion={reduced ? 'always' : 'user'}>
	<main class="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
		<nav aria-label="Motion navigation" class="mb-8 flex gap-4 text-sm">
			<a href="/" class="underline underline-offset-4">Bedrock UI</a>
			<a href="/docs/motion" class="underline underline-offset-4">Motion guide</a>
		</nav>
		<header class="mb-10 grid gap-6 border-b pb-10 md:grid-cols-[1.3fr_1fr] md:items-end">
			<div>
				<p class="mb-4 font-mono text-xs tracking-widest text-muted-foreground uppercase">
					Astra / Motion workbench
				</p>
				<h1 class="max-w-xl text-4xl leading-[1.08] font-semibold tracking-tight sm:text-5xl">
					Less motion.<br />More meaning.
				</h1>
			</div>
			<div class="max-w-md">
				<p class="leading-relaxed text-muted-foreground">
					Feedback should feel immediate. State changes should be easy to follow. Start with Astra
					CSS; reach for JavaScript when movement needs physics or layout.
				</p>
				<a
					href="/demo/ui"
					class="mt-4 inline-block text-sm font-medium underline underline-offset-4"
					>Explore layout interactions →</a
				>
			</div>
		</header>
		<div
			class="mb-6 flex flex-wrap items-center justify-between gap-5 rounded-xl border bg-muted/30 p-4"
		>
			<label class="flex cursor-pointer items-center gap-3 text-sm font-medium">
				<input
					data-testid="bedrock-motion-reduced"
					type="checkbox"
					bind:checked={reduced}
					class="size-4 accent-current"
				/> Reduce motion
			</label>
			<label class="flex items-center gap-3 text-sm">
				<span>CSS duration</span>
				<input
					aria-label="CSS duration"
					type="range"
					min="0.1"
					max="0.6"
					step="0.02"
					bind:value={duration}
					class="w-28 accent-current"
				/>
				<output class="w-12 font-mono text-xs tabular-nums">{duration.toFixed(2)} s</output>
			</label>
			<span class="text-xs text-muted-foreground"
				>{reduced
					? 'Final states, without interpolation'
					: 'Follows your system motion preference'}</span
			>
		</div>
		<div class="grid gap-6 md:grid-cols-2">
			<section class="flex min-w-0 flex-col rounded-2xl border p-5 sm:p-6">
				<div class="mb-3 flex items-center justify-between gap-3">
					<h2 class="text-xl font-semibold">CSS backend</h2>
					<span
						class="rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground"
						>Default</span
					>
				</div>
				<p class="mb-5 text-sm leading-relaxed text-muted-foreground">
					Finite transitions, native activation, and an exit you can reverse. Change the duration,
					then move or toggle the panel.
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
				<div
					class="mb-6 flex min-h-48 items-center overflow-clip rounded-xl border border-dashed p-3"
				>
					{#if cssVisible}
						<CssPanel
							id="css-motion-panel"
							data-testid="bedrock-css-panel"
							class="w-full rounded-xl bg-muted p-5"
							motion={{
								initial: { opacity: 0, y: 12 },
								animate: { opacity: 1, y: 0, x: move ? 32 : 0 },
								exit: { opacity: 0, y: -12 },
								transition: { duration, ease: 'easeOut' },
								reducedMotion: reduced ? 'always' : 'user'
							}}
						>
							<p class="mb-3 font-medium">Ready when you are.</p>
							<CssButton
								data-testid="bedrock-native-action"
								variant="outline"
								onclick={() => pressed++}>Pressed {pressed} times</CssButton
							>
						</CssPanel>
					{/if}
				</div>
				<CodeBlock
					class="mt-auto bg-background"
					code={cssExample}
					title="CSS Motion"
					language="svelte"
				/>
			</section>
			<section class="flex min-w-0 flex-col rounded-2xl border p-5 sm:p-6">
				<div class="mb-3 flex items-center justify-between gap-3">
					<h2 class="text-xl font-semibold">JavaScript backend</h2>
					<span class="rounded-full border px-2.5 py-1 text-xs text-muted-foreground"
						>Physics &amp; layout</span
					>
				</div>
				<p class="mb-5 text-sm leading-relaxed text-muted-foreground">
					A spring carries momentum through interruption. Use JavaScript for layout projection,
					shared elements, and interactions that need physics.
				</p>
				<CssButton
					data-testid="bedrock-engine-toggle"
					class="mb-5 self-start"
					onclick={() => (engineVisible = !engineVisible)}
					aria-controls="spring-motion-panel"
					aria-expanded={engineVisible}>Toggle spring panel</CssButton
				>
				<div class="mb-6 flex min-h-48 items-center rounded-xl border border-dashed p-3">
					{#if engineVisible}
						<Motion
							id="spring-motion-panel"
							data-testid="bedrock-engine-panel"
							class="w-full rounded-xl bg-muted p-5"
							motion={{
								initial: { opacity: 0, y: 24, scale: 0.95 },
								animate: { opacity: 1, y: 0, scale: 1 },
								exit: { opacity: 0, y: -16, scale: 0.95 },
								transition: { type: 'spring', stiffness: 380, damping: 28 },
								reducedMotion: reduced ? 'always' : 'user'
							}}>A spring that can change its mind.</Motion
						>
					{/if}
				</div>
				<CodeBlock
					class="mt-auto bg-background"
					code={springExample}
					title="Spring Motion"
					language="svelte"
				/>
			</section>
		</div>
		<p class="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground">
			Native onclick owns button activation for pointer, Enter and Space. Use a separate surface
			when another primitive owns positioning transforms. CSS deliberately rejects springs, drag,
			keyframe arrays, dynamic variants, layout projection and per-frame callbacks. CSS-only
			applications can use the default entry. This workbench loads both backends so you can compare
			their behavior.
		</p>
	</main>
</MotionConfig>
