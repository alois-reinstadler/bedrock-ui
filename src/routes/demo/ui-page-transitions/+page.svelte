<script lang="ts">
	import { resolve } from '$app/paths';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { flushSync } from 'svelte';
	import Checkout from './checkout.svelte';
	import Journey from './journey.svelte';
	import Magazine from './magazine.svelte';
	import type { RunTransition } from './types';
	import Workspace from './workspace.svelte';

	type ScenarioId = 'magazine' | 'journey' | 'workspace' | 'checkout';
	type Scenario = {
		id: ScenarioId;
		index: string;
		title: string;
		pattern: string;
		description: string;
	};

	const scenarios: Scenario[] = [
		{
			id: 'magazine',
			index: '01',
			title: 'Magazin',
			pattern: 'Geteiltes Objekt',
			description:
				'Das gewählte Cover bleibt als visueller Anker erhalten und wird zur Artikelseite.'
		},
		{
			id: 'journey',
			index: '02',
			title: 'Reiseplan',
			pattern: 'Richtungswechsel',
			description: 'Vor und zurück bekommt eine räumliche Richtung – passend zur linearen Abfolge.'
		},
		{
			id: 'workspace',
			index: '03',
			title: 'Arbeitsbereich',
			pattern: 'Kontext bewahren',
			description:
				'Die Navigation bleibt ruhig, während sich die gewählte Zeile in die Tiefe öffnet.'
		},
		{
			id: 'checkout',
			index: '04',
			title: 'Abschluss',
			pattern: 'Entscheidung markieren',
			description: 'Ein deutlicher Reveal trennt den reversiblen Warenkorb vom bestätigten Zustand.'
		}
	];

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
	<header class="lab-header">
		<div class="header-nav">
			<a href={resolve('/demo/ui')}><ArrowLeftIcon class="size-4" /> Motion Lab</a>
			<span>Studie / 02</span>
		</div>
		<div class="header-copy">
			<div>
				<p class="kicker">Bedrock / Seitenwechsel</p>
				<h1>Motion mit<br />einer Aufgabe.</h1>
			</div>
			<p>
				Ein guter Übergang erklärt, was gerade passiert ist. Vier Szenarien zeigen Kontinuität,
				Richtung, räumlichen Kontext und Abschluss – jeweils direkt ausprobierbar.
			</p>
		</div>
	</header>

	<main class="lab-layout">
		<aside class="scenario-panel">
			<div class="scenario-heading">
				<span>Szenarien</span>
				<span>{activeScenario.index} / 04</span>
			</div>
			<nav aria-label="Übergangsszenarien">
				{#each scenarios as scenario (scenario.id)}
					<button
						type="button"
						class:active={active === scenario.id}
						aria-current={active === scenario.id ? 'page' : undefined}
						disabled={transitionActive}
						onclick={() => selectScenario(scenario.id)}
					>
						<span class="scenario-index">{scenario.index}</span>
						<span class="scenario-copy">
							<strong>{scenario.title}</strong>
							<small>{scenario.pattern}</small>
						</span>
						{#if active === scenario.id}
							<ArrowUpRightIcon class="scenario-arrow size-4" />
						{/if}
					</button>
				{/each}
			</nav>

			<div class="scenario-note">
				<p>{activeScenario.pattern}</p>
				<span>{activeScenario.description}</span>
			</div>
		</aside>

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

	<footer class="lab-footer">
		<div>
			<span class="footer-label">Prinzipien</span>
			{#each ['Absicht vor Effekt', 'Kontinuität vor Spektakel', 'Reduzierte Bewegung respektieren'] as principle (principle)}
				<span class="principle"><CheckIcon class="size-3" /> {principle}</span>
			{/each}
		</div>
		<p>Same-document View Transitions / CSS / Svelte 5</p>
	</footer>
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

	.lab-header,
	.lab-layout,
	.lab-footer {
		width: min(100%, 92rem);
		margin-inline: auto;
	}

	.header-nav,
	.scenario-heading,
	.demo-toolbar,
	.lab-footer,
	.kicker,
	.scenario-note p {
		font-size: 0.64rem;
		font-weight: 650;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.header-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 1.1rem;
		border-bottom: 1px solid rgb(30 30 27 / 18%);
		color: #6f6d66;
	}

	.header-nav a {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		transition: color 180ms ease;
	}

	.header-nav a:hover {
		color: #1e1e1b;
	}

	.header-copy {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.45fr);
		gap: 3rem;
		align-items: end;
		padding: clamp(2rem, 5vw, 4.5rem) 0;
	}

	.kicker {
		margin-bottom: 1rem;
		color: #77746d;
	}

	.header-copy h1 {
		max-width: 11ch;
		font-size: clamp(3.4rem, 8vw, 8rem);
		font-weight: 510;
		line-height: 0.79;
		letter-spacing: -0.08em;
	}

	.header-copy > p {
		max-width: 43ch;
		padding-bottom: 0.4rem;
		font-size: clamp(0.82rem, 1.2vw, 0.95rem);
		line-height: 1.65;
		color: #6b6962;
	}

	.lab-layout {
		display: grid;
		grid-template-columns: minmax(14rem, 18rem) minmax(0, 1fr);
		gap: clamp(1.5rem, 4vw, 4rem);
		align-items: start;
	}

	.scenario-panel {
		position: sticky;
		top: 1rem;
	}

	.scenario-heading {
		display: flex;
		justify-content: space-between;
		padding-bottom: 0.7rem;
		border-bottom: 1px solid rgb(30 30 27 / 18%);
		color: #7a7770;
	}

	.scenario-panel nav {
		display: flex;
		flex-direction: column;
	}

	.scenario-panel nav button {
		display: grid;
		grid-template-columns: 1.8rem minmax(0, 1fr) auto;
		gap: 0.65rem;
		align-items: center;
		width: 100%;
		padding: 1rem 0;
		border-bottom: 1px solid rgb(30 30 27 / 11%);
		text-align: left;
		transition: opacity 180ms ease;
	}

	.scenario-panel nav button:not(.active) {
		opacity: 0.46;
	}

	.scenario-panel nav button:not(.active):hover {
		opacity: 0.8;
	}

	.scenario-panel nav button:disabled {
		cursor: wait;
	}

	.scenario-index {
		font-size: 0.63rem;
		font-variant-numeric: tabular-nums;
	}

	.scenario-copy {
		display: flex;
		flex-direction: column;
		gap: 0.18rem;
	}

	.scenario-copy strong {
		font-size: 0.86rem;
		font-weight: 650;
	}

	.scenario-copy small {
		font-size: 0.63rem;
		color: #77746d;
	}

	.scenario-note {
		margin-top: 2rem;
		padding: 1rem;
		border: 1px solid rgb(30 30 27 / 12%);
		border-radius: 0.8rem;
		background: rgb(255 255 255 / 35%);
	}

	.scenario-note p {
		margin-bottom: 0.5rem;
	}

	.scenario-note span {
		display: block;
		font-size: 0.72rem;
		line-height: 1.55;
		color: #737068;
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

	.lab-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid rgb(30 30 27 / 15%);
		color: #77746d;
	}

	.lab-footer > div {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.footer-label {
		padding: 0.43rem 0;
	}

	.principle {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.4rem 0.6rem;
		border: 1px solid rgb(30 30 27 / 13%);
		border-radius: 999px;
		background: rgb(255 255 255 / 35%);
		letter-spacing: 0.03em;
		text-transform: none;
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
		.header-copy {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.lab-layout {
			grid-template-columns: 1fr;
		}

		.scenario-panel {
			position: static;
		}

		.scenario-panel nav {
			display: grid;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			gap: 0.5rem;
			margin-top: 0.75rem;
		}

		.scenario-panel nav button {
			grid-template-columns: auto 1fr;
			padding: 0.75rem;
			border: 1px solid rgb(30 30 27 / 12%);
			border-radius: 0.75rem;
		}

		:global(.scenario-arrow),
		.scenario-note {
			display: none;
		}
	}

	@media (max-width: 640px) {
		.lab-shell {
			padding: 0.75rem;
		}

		.header-copy {
			padding: 2.5rem 0;
		}

		.header-copy h1 {
			font-size: 3.8rem;
		}

		.scenario-panel nav {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.demo-toolbar {
			grid-template-columns: 1fr 1fr;
		}

		.demo-toolbar > span {
			display: none;
		}

		.lab-footer,
		.lab-footer > div {
			align-items: start;
			flex-direction: column;
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
