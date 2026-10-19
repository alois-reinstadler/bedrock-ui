<script lang="ts">
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	import MotionProvider from '#lib/bedrock/motion/MotionProvider.svelte';
	import NativeExample from '#lib/site/guide-examples/motion-native.svelte';
	import EngineExample from '#lib/site/guide-examples/motion-engine.svelte';
	import Composition from '#lib/site/guide-examples/motion-composition.svelte';
	let reduced = $state(false);
</script>

<svelte:head>
	<title>Motion — Bedrock</title>
	<meta
		name="description"
		content="Quiet controls and coordinated motion, with one Bedrock policy."
	/>
</svelte:head>

<MotionProvider {reduced}>
	<main class="mx-auto max-w-5xl px-6 py-16">
		<nav aria-label="Motion navigation" class="mb-8 flex gap-4 text-sm">
			<a href="/" class="underline underline-offset-4">Bedrock UI</a>
			<a href="/docs/motion" class="underline underline-offset-4">Motion guide</a>
		</nav>
		<p class="mb-3 text-sm text-muted-foreground">BEDROCK / MOTION</p>
		<h1 class="mb-5 text-4xl font-semibold tracking-tight">Movement with a purpose.</h1>
		<p class="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
			Quiet feedback for everyday controls. Coordinated movement when an interface changes shape.
			The same preferences apply to both.
		</p>
		<label for="bedrock-motion-reduced" class="mb-8 flex items-center gap-2"
			><Checkbox
				id="bedrock-motion-reduced"
				data-testid="bedrock-motion-reduced"
				bind:checked={reduced}
			/> Reduce motion</label
		>
		<div class="grid gap-6 md:grid-cols-2">
			<section class="rounded-xl border p-6">
				<h2 class="mb-3 text-xl font-semibold">Simple feedback</h2>
				<p class="mb-5 text-sm leading-relaxed text-muted-foreground">
					A standard button, a disclosure, and a surface that moves to its next position.
				</p>
				<NativeExample />
			</section>
			<section class="rounded-xl border p-6">
				<h2 class="mb-3 text-xl font-semibold">Coordinated presence</h2>
				<p class="mb-5 text-sm leading-relaxed text-muted-foreground">
					A surface stays visible while it leaves, and responds when you change your mind.
				</p>
				<EngineExample />
			</section>
		</div>
		<section class="mt-10 rounded-xl border p-6" aria-labelledby="composition-heading">
			<h2 id="composition-heading" class="mb-3 text-xl font-semibold">Keep your place</h2>
			<p class="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
				Related content moves together as a project expands or the list changes order. Your keyboard
				focus stays with the task.
			</p>
			<Composition />
		</section>
	</main>
</MotionProvider>
