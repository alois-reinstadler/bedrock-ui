<script lang="ts">
	import { resolve } from '$app/paths';
	import EvaluationPanel from '#lib/site/motion-lab/EvaluationPanel.svelte';
	import { labPages } from '#lib/site/motion-lab/types.js';

	const architecture = [
		[
			'CSS first',
			'Astra CSS handles finite opacity and transform feedback without loading the physics engine.'
		],
		[
			'JavaScript when needed',
			'Astra createLayout measures geometry, projects shared identities, and preserves spring continuity.'
		],
		[
			'Presence',
			'Astra cssTransition delegates entering, reversal, and outro retention to Svelte.'
		],
		[
			'Accessibility',
			'Native semantics, focus restoration, and reduced-motion policy remain part of each interaction.'
		],
		[
			'Inspection controls',
			'Slow motion and pause apply to the CSS probes. Reduced motion also controls JavaScript projection; Normal respects the system preference.'
		]
	] as const;

	const questions = [
		'Ist Bewegung zweckmäßig und zurückhaltend?',
		'Skaliert Dauer mit Größe und visuellem Gewicht?',
		'Bleiben Richtung, Ursprung und Kontinuität lesbar?',
		'Kann Bewegung unterbrochen und neu anvisiert werden?',
		'Bleibt direkte Manipulation 1:1 am Pointer?',
		'Ist Reduced Motion ein echter Alternativmodus?',
		'Bleibt das System unter Last compositor-freundlich?',
		'Wo ist keine Animation die beste Entscheidung?'
	];
</script>

<div class="page-stack">
	<section class="intro">
		<p class="kicker">Astra motion in practice</p>
		<h2>CSS for feedback. JavaScript for continuity.</h2>
		<p>
			Jeder Test zeigt den entscheidenden Härtefall, technische Motion-Daten und einen Befund. The
			control rail adjusts CSS probes; reduced motion also controls Astra projection.
		</p>
		<div class="question-grid">
			{#each questions as question, index (question)}
				<div><span>{String(index + 1).padStart(2, '0')}</span>{question}</div>
			{/each}
		</div>
	</section>

	<section class="architecture">
		<header>
			<p>Ist-Zustand</p>
			<h2>Astra motion architecture</h2>
		</header>
		<dl>
			{#each architecture as [term, description] (term)}
				<div>
					<dt>{term}</dt>
					<dd>{description}</dd>
				</div>
			{/each}
		</dl>
		<div class="truth">
			<strong>Choose the smallest capable engine</strong>
			<p>
				Use CSS for finite, interruptible feedback. Choose Astra JavaScript when geometry must be
				measured or a physical spring must preserve velocity. The examples keep those
				responsibilities explicit.
			</p>
		</div>
	</section>

	<section class="routes" aria-labelledby="route-heading">
		<header>
			<p>Benchmark-Matrix</p>
			<h2 id="route-heading">Fünf Belastungsfelder</h2>
		</header>
		<div class="route-grid">
			{#each labPages.slice(1) as item, index (item.href)}
				<a href={resolve(item.href)}>
					<span>{String(index + 1).padStart(2, '0')}</span>
					<strong>{item.title}</strong>
					<p>{item.description}</p>
					<em>Öffnen →</em>
				</a>
			{/each}
		</div>
	</section>

	<EvaluationPanel />
</div>

<style>
	.page-stack {
		display: grid;
		gap: 1.5rem;
	}
	.intro,
	.architecture,
	.routes {
		border: 1px solid var(--border);
		border-radius: 1.35rem;
		background: var(--card);
		padding: clamp(1.2rem, 4vw, 2rem);
	}
	.kicker,
	section > header p {
		color: var(--muted-foreground);
		font-size: 0.7rem;
		font-weight: 650;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	h2 {
		margin-top: 0.3rem;
		max-width: 22ch;
		font-size: clamp(1.5rem, 3vw, 2.4rem);
		font-weight: 660;
		letter-spacing: -0.035em;
		line-height: 1.08;
	}
	.intro > p:not(.kicker) {
		max-width: 65ch;
		margin-top: 0.8rem;
		color: var(--muted-foreground);
		font-size: 0.9rem;
		line-height: 1.6;
	}
	.question-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1px;
		margin-top: 1.5rem;
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: 0.9rem;
		background: var(--border);
	}
	.question-grid div {
		display: flex;
		gap: 0.65rem;
		background: var(--card);
		padding: 0.8rem;
		font-size: 0.77rem;
	}
	.question-grid span {
		color: var(--muted-foreground);
		font-family: ui-monospace, monospace;
		font-size: 0.65rem;
	}
	dl {
		margin-top: 1rem;
		border-top: 1px solid var(--border);
	}
	dl div {
		display: grid;
		grid-template-columns: minmax(9rem, 0.3fr) 1fr;
		gap: 1rem;
		border-bottom: 1px solid var(--border);
		padding: 0.75rem 0;
	}
	dt {
		font-size: 0.76rem;
		font-weight: 650;
	}
	dd {
		color: var(--muted-foreground);
		font-family: ui-monospace, monospace;
		font-size: 0.72rem;
		line-height: 1.5;
	}
	.truth {
		margin-top: 1rem;
		border-radius: 0.9rem;
		background: color-mix(in oklab, #f59e0b, transparent 90%);
		padding: 1rem;
	}
	.truth strong {
		font-size: 0.76rem;
	}
	.truth p {
		margin-top: 0.25rem;
		color: var(--muted-foreground);
		font-size: 0.76rem;
		line-height: 1.5;
	}
	.route-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.65rem;
		margin-top: 1rem;
	}
	.route-grid a {
		display: grid;
		min-height: 10rem;
		border: 1px solid var(--border);
		border-radius: 0.9rem;
		padding: 1rem;
		transition:
			transform var(--motion-state),
			border-color var(--motion-state);
	}
	.route-grid a:hover {
		transform: translateY(-2px);
		border-color: var(--foreground);
	}
	.route-grid span {
		color: var(--muted-foreground);
		font-family: ui-monospace, monospace;
		font-size: 0.65rem;
	}
	.route-grid strong {
		margin-top: 0.7rem;
	}
	.route-grid p {
		margin-top: 0.25rem;
		color: var(--muted-foreground);
		font-size: 0.75rem;
	}
	.route-grid em {
		align-self: end;
		margin-top: 1rem;
		color: var(--muted-foreground);
		font-size: 0.72rem;
		font-style: normal;
	}

	@media (max-width: 42rem) {
		.question-grid,
		.route-grid {
			grid-template-columns: 1fr;
		}
		dl div {
			grid-template-columns: 1fr;
		}
	}
</style>
