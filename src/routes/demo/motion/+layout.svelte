<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { MotionConfig } from '#lib/bedrock/motion/config.js';
	import ControlRail from '#lib/site/motion-lab/ControlRail.svelte';
	import { provideMotionLabState } from '#lib/site/motion-lab/context.svelte.js';
	import { labPages } from '#lib/site/motion-lab/types.js';

	let { children } = $props();
	const state = provideMotionLabState();
	let currentPath = $derived(page.url.pathname);
</script>

<svelte:head>
	<title>Motion Lab · Bedrock UI</title>
	<meta
		name="description"
		content="Ein umfassender Benchmark für die Bewegungssprache von Bedrock UI."
	/>
</svelte:head>

<div
	class="motion-lab"
	data-motion-preference={state.preference}
	data-input-mode={state.inputMode}
	data-stress-mode={state.stressMode}
	data-paused={state.paused}
	style:--lab-time-scale={state.timeScale}
>
	<header class="lab-header">
		<div>
			<a class="back" href={resolve('/demo')}>← Demos</a>
			<p>Bedrock UI · Systemdiagnose</p>
			<h1>Motion Lab</h1>
			<span>Kein Animationskatalog. Ein Belastungstest für eine kohärente Interaktionssprache.</span
			>
		</div>
		<div class="principle">
			<strong>Leitfrage</strong>
			<span>Hilft diese Bewegung bei Orientierung, Kontinuität, Feedback oder Aufmerksamkeit?</span>
		</div>
	</header>

	<nav class="page-nav" aria-label="Motion-Lab-Bereiche">
		{#each labPages as item, index (item.href)}
			<a href={resolve(item.href)} aria-current={currentPath === item.href ? 'page' : undefined}>
				<span>{String(index + 1).padStart(2, '0')}</span>
				{item.shortTitle}
			</a>
		{/each}
	</nav>

	<div class="lab-grid">
		<ControlRail />
		<main id="motion-lab-content" tabindex="-1">
			<MotionConfig reducedMotion={state.preference === 'reduced' ? 'always' : 'user'}>
				{#key state.replayKey}
					{@render children()}
				{/key}
			</MotionConfig>
		</main>
	</div>
</div>

<style>
	.motion-lab {
		--motion-press: calc(130ms * var(--lab-time-scale));
		--motion-state: calc(175ms * var(--lab-time-scale));
		--motion-enter: calc(230ms * var(--lab-time-scale));
		--motion-exit: calc(175ms * var(--lab-time-scale));
		--motion-reveal: calc(310ms * var(--lab-time-scale));
		--motion-overlay: calc(410ms * var(--lab-time-scale));
		--motion-layout: calc(500ms * var(--lab-time-scale));
		--ease-enter: cubic-bezier(0.23, 1, 0.32, 1);
		--ease-exit: cubic-bezier(0.3, 0, 0.6, 0.6);
		--ease-move: cubic-bezier(0.77, 0, 0.175, 1);
		--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
		min-height: 100dvh;
		background:
			radial-gradient(
				circle at 75% -10%,
				color-mix(in oklab, #0ea5e9, transparent 90%),
				transparent 35rem
			),
			var(--background);
		color: var(--foreground);
	}

	.lab-header {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 2rem;
		max-width: 1500px;
		margin: 0 auto;
		padding: 3.5rem clamp(1rem, 4vw, 3rem) 2rem;
	}
	.back {
		display: inline-block;
		margin-bottom: 2.5rem;
		color: var(--muted-foreground);
		font-size: 0.78rem;
	}
	.lab-header p {
		color: var(--muted-foreground);
		font-size: 0.68rem;
		font-weight: 650;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}
	.lab-header h1 {
		margin-top: 0.25rem;
		font-size: clamp(2.8rem, 7vw, 6rem);
		font-weight: 650;
		letter-spacing: -0.06em;
		line-height: 0.95;
	}
	.lab-header div > span {
		display: block;
		max-width: 48rem;
		margin-top: 1rem;
		color: var(--muted-foreground);
		font-size: clamp(0.9rem, 1.5vw, 1.1rem);
	}
	.principle {
		max-width: 22rem;
		border-left: 2px solid var(--foreground);
		padding-left: 1rem;
	}
	.principle strong,
	.principle span {
		display: block;
	}
	.principle strong {
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.principle span {
		margin-top: 0.3rem;
		color: var(--muted-foreground);
		font-size: 0.8rem;
		line-height: 1.5;
	}
	.page-nav {
		position: sticky;
		top: 0;
		z-index: 40;
		display: flex;
		gap: 0.25rem;
		overflow-x: auto;
		border-block: 1px solid var(--border);
		background: color-mix(in oklab, var(--background), transparent 5%);
		padding: 0.55rem max(1rem, calc((100vw - 1500px) / 2 + 3rem));
		backdrop-filter: blur(18px);
	}
	.page-nav a {
		display: inline-flex;
		flex: none;
		align-items: center;
		gap: 0.45rem;
		border-radius: 0.65rem;
		padding: 0.5rem 0.7rem;
		color: var(--muted-foreground);
		font-size: 0.78rem;
		font-weight: 580;
	}
	.page-nav a:hover,
	.page-nav a[aria-current='page'] {
		background: var(--muted);
		color: var(--foreground);
	}
	.page-nav span {
		font-family: ui-monospace, monospace;
		font-size: 0.62rem;
		opacity: 0.65;
	}
	.lab-grid {
		display: grid;
		grid-template-columns: minmax(15rem, 18rem) minmax(0, 1fr);
		gap: clamp(1rem, 3vw, 2.5rem);
		max-width: 1500px;
		margin: 0 auto;
		padding: 1.5rem clamp(1rem, 4vw, 3rem) 6rem;
	}
	main {
		min-width: 0;
	}

	.motion-lab[data-paused='true'] :global(.lab-animated),
	.motion-lab[data-paused='true'] :global(.lab-loop) {
		animation-play-state: paused !important;
	}
	.motion-lab[data-motion-preference='reduced'] :global(.lab-spatial) {
		transform: none !important;
		translate: none !important;
		scale: none !important;
	}
	.motion-lab[data-motion-preference='reduced'] :global(.lab-loop) {
		animation: none !important;
	}
	.motion-lab[data-motion-preference='reduced'] :global(.lab-animated) {
		animation-duration: 1ms !important;
		transition-duration: 80ms !important;
		transition-property: opacity, color, background-color, border-color !important;
	}

	@media (max-width: 64rem) {
		.lab-grid {
			grid-template-columns: 1fr;
		}
		.lab-header {
			align-items: start;
			flex-direction: column;
		}
	}
</style>
