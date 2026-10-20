<script lang="ts">
	import { scenarios, type ScenarioId } from './scenarios';
	import LabHeader from './LabHeader.svelte';
	import ScenarioNavigation from './ScenarioNavigation.svelte';
	import LabFooter from './LabFooter.svelte';

	import { flushSync } from 'svelte';
	import Checkout from './checkout.svelte';
	import Journey from './journey.svelte';
	import Magazine from './magazine.svelte';
	import type { RunTransition } from './types';
	import Workspace from './workspace.svelte';

	let active = $state<ScenarioId>('magazine');
	let transitionActive = $state(false);

	const activeScenario = $derived(
		scenarios.find((scenario) => scenario.id === active) ?? scenarios[0]
	);

	const runTransition: RunTransition = (kind, update, prepare) => {
		if (transitionActive) return;
		if (prepare) flushSync(prepare);

		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reducedMotion || typeof document.startViewTransition !== 'function') {
			flushSync(update);
			return;
		}

		transitionActive = true;
		document.documentElement.dataset.pageTransition = kind;
		const transition = document.startViewTransition(() => flushSync(update));
		transition.finished.finally(() => {
			delete document.documentElement.dataset.pageTransition;
			transitionActive = false;
		});
	};

	function selectScenario(id: ScenarioId) {
		if (id === active) return;
		runTransition('switch', () => (active = id));
	}
</script>

<svelte:head>
	<title>Seitenwechsel – Bedrock Motion Lab</title>
	<meta
		name="description"
		content="Vier interaktive Studien für schöne, verständliche Seitenübergänge."
	/>
</svelte:head>

<div class="lab-shell">
	<LabHeader />

	<main class="lab-layout">
		<ScenarioNavigation {active} {activeScenario} {transitionActive} {selectScenario} />

		<section class="demo-panel" aria-live="polite">
			<div class="demo-toolbar">
				<div class="window-dots" aria-hidden="true"><i></i><i></i><i></i></div>
				<span>Interaktive Vorschau</span>
				<div class="live-label"><i></i> Bereit</div>
			</div>

			<div class="demo-viewport">
				{#key active}
					{#if active === 'magazine'}
						<Magazine {runTransition} />
					{:else if active === 'journey'}
						<Journey {runTransition} />
					{:else if active === 'workspace'}
						<Workspace {runTransition} />
					{:else}
						<Checkout {runTransition} />
					{/if}
				{/key}
			</div>
		</section>
	</main>

	<LabFooter />
</div>

<style>
	:global(body) {
		background: #f3f1eb;
	}
	.lab-shell {
		min-height: 100dvh;
		padding: clamp(1rem, 3vw, 2.5rem);
		background:
			linear-gradient(90deg, rgb(33 32 28 / 3%) 1px, transparent 1px) 0 0 / 5rem 5rem,
			#f3f1eb;
		color: #1e1e1b;
	}
	.lab-layout {
		width: min(100%, 92rem);
		margin-inline: auto;
	}
	.demo-toolbar {
		font-size: 0.64rem;
		font-weight: 650;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.lab-layout {
		display: grid;
		grid-template-columns: minmax(14rem, 18rem) minmax(0, 1fr);
		gap: clamp(1.5rem, 4vw, 4rem);
		align-items: start;
	}

	.demo-panel {
		min-width: 0;
		overflow: hidden;
		border: 1px solid rgb(30 30 27 / 20%);
		border-radius: 1.15rem;
		background: #dedbd4;
		box-shadow: 0 2rem 5rem -3rem rgb(33 31 25 / 42%);
	}
	.demo-toolbar {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		height: 2.7rem;
		padding: 0 0.9rem;
		border-bottom: 1px solid rgb(30 30 27 / 14%);
		color: #77746d;
	}
	.window-dots {
		display: flex;
		gap: 0.3rem;
	}
	.window-dots i,
	.live-label i {
		display: block;
		width: 0.38rem;
		aspect-ratio: 1;
		border-radius: 50%;
		background: #aaa69e;
	}
	.live-label {
		display: inline-flex;
		align-items: center;
		justify-self: end;
		gap: 0.4rem;
	}
	.live-label i {
		background: #68a13e;
		box-shadow: 0 0 0 0.2rem rgb(104 161 62 / 13%);
	}
	.demo-viewport {
		position: relative;
		isolation: isolate;
	}
	:global(.transition-stage) {
		overflow: hidden;
		view-transition-name: demo-stage;
	}

	:global(::view-transition-old(root)),
	:global(::view-transition-new(root)) {
		animation: none;
	}
	:global(::view-transition-group(demo-stage)) {
		animation-duration: 650ms;
		animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
	}
	:global(html[data-page-transition='switch']::view-transition-old(demo-stage)) {
		animation: switch-out 360ms cubic-bezier(0.4, 0, 1, 1) both;
	}
	:global(html[data-page-transition='switch']::view-transition-new(demo-stage)) {
		animation: switch-in 560ms 80ms cubic-bezier(0.16, 1, 0.3, 1) both;
	}
	:global(html[data-page-transition='shared-forward']::view-transition-old(demo-stage)),
	:global(html[data-page-transition='shared-back']::view-transition-old(demo-stage)) {
		animation: soft-out 420ms ease both;
	}
	:global(html[data-page-transition='shared-forward']::view-transition-new(demo-stage)),
	:global(html[data-page-transition='shared-back']::view-transition-new(demo-stage)) {
		animation: soft-in 560ms 100ms ease both;
	}
	:global(::view-transition-group(shared-cover)),
	:global(::view-transition-group(shared-title)),
	:global(::view-transition-group(shared-row)) {
		z-index: 12;
		animation-duration: 720ms;
		animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
	}
	:global(::view-transition-old(shared-cover)),
	:global(::view-transition-new(shared-cover)) {
		border-radius: 0.18rem;
		mix-blend-mode: normal;
	}
	:global(html[data-page-transition='push-forward']::view-transition-old(demo-stage)) {
		animation: push-out-left 600ms cubic-bezier(0.65, 0, 0.35, 1) both;
	}
	:global(html[data-page-transition='push-forward']::view-transition-new(demo-stage)) {
		animation: push-in-right 600ms cubic-bezier(0.65, 0, 0.35, 1) both;
	}
	:global(html[data-page-transition='push-back']::view-transition-old(demo-stage)) {
		animation: push-out-right 600ms cubic-bezier(0.65, 0, 0.35, 1) both;
	}
	:global(html[data-page-transition='push-back']::view-transition-new(demo-stage)) {
		animation: push-in-left 600ms cubic-bezier(0.65, 0, 0.35, 1) both;
	}
	:global(html[data-page-transition='depth-forward']::view-transition-old(workspace-content)) {
		animation: depth-out 420ms cubic-bezier(0.4, 0, 1, 1) both;
	}
	:global(html[data-page-transition='depth-forward']::view-transition-new(workspace-content)) {
		animation: depth-in 620ms 80ms cubic-bezier(0.16, 1, 0.3, 1) both;
	}
	:global(html[data-page-transition='depth-back']::view-transition-old(workspace-content)) {
		animation: depth-back-out 420ms cubic-bezier(0.4, 0, 1, 1) both;
	}
	:global(html[data-page-transition='depth-back']::view-transition-new(workspace-content)) {
		animation: depth-back-in 620ms 60ms cubic-bezier(0.16, 1, 0.3, 1) both;
	}
	:global(::view-transition-old(workspace-rail)),
	:global(::view-transition-new(workspace-rail)) {
		animation: none;
		mix-blend-mode: normal;
	}
	:global(html[data-page-transition='commit']::view-transition-old(demo-stage)) {
		animation: none;
	}
	:global(html[data-page-transition='commit']::view-transition-new(demo-stage)) {
		animation: commit-reveal 850ms cubic-bezier(0.7, 0, 0.2, 1) both;
		mix-blend-mode: normal;
	}
	:global(html[data-page-transition='reset']::view-transition-old(demo-stage)) {
		animation: soft-out 300ms ease both;
	}
	:global(html[data-page-transition='reset']::view-transition-new(demo-stage)) {
		animation: soft-in 450ms ease both;
	}
	@keyframes switch-out {
		to {
			opacity: 0;
			transform: scale(0.975) translateY(0.5rem);
			filter: blur(4px);
		}
	}
	@keyframes switch-in {
		from {
			opacity: 0;
			transform: scale(1.02) translateY(0.75rem);
			filter: blur(5px);
		}
	}
	@keyframes soft-out {
		to {
			opacity: 0;
		}
	}
	@keyframes soft-in {
		from {
			opacity: 0;
		}
	}
	@keyframes push-out-left {
		to {
			transform: translateX(-24%);
			opacity: 0.25;
			filter: blur(3px);
		}
	}
	@keyframes push-in-right {
		from {
			transform: translateX(100%);
		}
	}
	@keyframes push-out-right {
		to {
			transform: translateX(24%);
			opacity: 0.25;
			filter: blur(3px);
		}
	}
	@keyframes push-in-left {
		from {
			transform: translateX(-100%);
		}
	}
	@keyframes depth-out {
		to {
			opacity: 0;
			transform: scale(0.94);
			filter: blur(5px);
		}
	}
	@keyframes depth-in {
		from {
			opacity: 0;
			transform: translateY(1.5rem) scale(1.035);
			filter: blur(6px);
		}
	}
	@keyframes depth-back-out {
		to {
			opacity: 0;
			transform: translateY(1.5rem) scale(1.035);
			filter: blur(5px);
		}
	}
	@keyframes depth-back-in {
		from {
			opacity: 0;
			transform: scale(0.94);
			filter: blur(5px);
		}
	}
	@keyframes commit-reveal {
		from {
			clip-path: circle(0% at 88% 84%);
		}
		to {
			clip-path: circle(145% at 88% 84%);
		}
	}
	@media (max-width: 900px) {
		.lab-layout {
			grid-template-columns: 1fr;
		}

		:global(.scenario-arrow) {
			display: none;
		}
	}
	@media (max-width: 640px) {
		.lab-shell {
			padding: 0.75rem;
		}

		.demo-toolbar {
			grid-template-columns: 1fr 1fr;
		}
		.demo-toolbar > span {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		:global(::view-transition-group(*)),
		:global(::view-transition-old(*)),
		:global(::view-transition-new(*)) {
			animation-duration: 1ms !important;
			animation-delay: 0ms !important;
		}
	}
</style>
