<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { BenchmarkVerdict, MotionMetadata } from './types.js';

	let {
		id,
		title,
		summary,
		hardCase,
		metadata,
		verdict = 'beobachten',
		finding,
		children,
		actions
	}: {
		id: string;
		title: string;
		summary: string;
		hardCase: string;
		metadata: MotionMetadata;
		verdict?: BenchmarkVerdict;
		finding?: string;
		children: Snippet;
		actions?: Snippet;
	} = $props();

	const labels: Record<BenchmarkVerdict, string> = {
		bestanden: 'Stimmig',
		beobachten: 'Prüfen',
		problem: 'Problem',
		'kein-motion': 'Bewusst instant'
	};
</script>

<article class="benchmark" {id} data-testid={`benchmark-${id}`} data-verdict={verdict}>
	<header>
		<div>
			<div class="labels">
				<span class="role">{metadata.role}</span>
				<span class="verdict">{labels[verdict]}</span>
			</div>
			<h3>{title}</h3>
			<p>{summary}</p>
		</div>
		{#if actions}<div class="header-actions">{@render actions()}</div>{/if}
	</header>

	<div class="stage" data-testid={`stage-${id}`}>
		{@render children()}
	</div>

	<div class="hard-case">
		<strong>Entscheidender Härtefall</strong>
		<span>{hardCase}</span>
	</div>

	{#if finding}
		<p class="finding"><strong>Befund:</strong> {finding}</p>
	{/if}

	<details>
		<summary>Technische Motion-Daten</summary>
		<dl>
			<div>
				<dt>Rolle</dt>
				<dd>{metadata.role}</dd>
			</div>
			<div>
				<dt>Dauer / Token</dt>
				<dd>{metadata.duration}</dd>
			</div>
			<div>
				<dt>Easing / Feder</dt>
				<dd>{metadata.easing}</dd>
			</div>
			<div>
				<dt>Verzögerung</dt>
				<dd>{metadata.delay ?? '0 ms'}</dd>
			</div>
			<div>
				<dt>Distanz</dt>
				<dd>{metadata.distance ?? 'Keine'}</dd>
			</div>
			<div>
				<dt>Ursprung</dt>
				<dd>{metadata.origin ?? 'Nicht relevant'}</dd>
			</div>
			<div>
				<dt>CSS-Eigenschaften</dt>
				<dd>{metadata.properties}</dd>
			</div>
			<div>
				<dt>Layout</dt>
				<dd>{metadata.layout}</dd>
			</div>
			<div>
				<dt>Schleife</dt>
				<dd>{metadata.loop}</dd>
			</div>
			<div>
				<dt>Reduced Motion</dt>
				<dd>{metadata.reduced}</dd>
			</div>
		</dl>
	</details>
</article>

<style>
	.benchmark {
		scroll-margin-top: 5rem;
		overflow: clip;
		border: 1px solid var(--border);
		border-radius: 1.35rem;
		background: var(--card);
	}
	header {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.15rem 1.2rem 1rem;
	}
	.labels {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-bottom: 0.55rem;
	}
	.labels span {
		border-radius: 999px;
		padding: 0.2rem 0.5rem;
		font-size: 0.68rem;
		font-weight: 650;
		letter-spacing: 0.035em;
	}
	.role {
		background: var(--muted);
		color: var(--muted-foreground);
	}
	.verdict {
		background: color-mix(in oklab, #0ea5e9, transparent 86%);
		color: #03658a;
	}
	[data-verdict='problem'] .verdict {
		background: color-mix(in oklab, #ef4444, transparent 86%);
		color: #b42318;
	}
	[data-verdict='bestanden'] .verdict {
		background: color-mix(in oklab, #16a34a, transparent 86%);
		color: #08752c;
	}
	[data-verdict='kein-motion'] .verdict {
		background: color-mix(in oklab, #8b5cf6, transparent 86%);
		color: #6842b8;
	}
	h3 {
		font-size: 1.05rem;
		font-weight: 680;
		letter-spacing: -0.015em;
	}
	header p {
		margin-top: 0.25rem;
		max-width: 60ch;
		color: var(--muted-foreground);
		font-size: 0.82rem;
		line-height: 1.5;
	}
	.stage {
		min-height: 10rem;
		border-block: 1px solid var(--border);
		background: color-mix(in oklab, var(--muted), transparent 42%);
		padding: clamp(1rem, 3vw, 1.75rem);
	}
	.hard-case {
		display: grid;
		grid-template-columns: minmax(8rem, 0.28fr) 1fr;
		gap: 1rem;
		padding: 0.8rem 1.2rem;
		font-size: 0.76rem;
		line-height: 1.5;
	}
	.hard-case strong {
		color: var(--foreground);
	}
	.hard-case span {
		color: var(--muted-foreground);
	}
	.finding {
		border-top: 1px solid var(--border);
		padding: 0.8rem 1.2rem;
		color: var(--muted-foreground);
		font-size: 0.76rem;
		line-height: 1.5;
	}
	details {
		border-top: 1px solid var(--border);
	}
	details summary {
		cursor: pointer;
		padding: 0.8rem 1.2rem;
		color: var(--muted-foreground);
		font-size: 0.75rem;
		font-weight: 650;
	}
	details summary:hover {
		color: var(--foreground);
	}
	dl {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1px;
		background: var(--border);
		border-top: 1px solid var(--border);
	}
	dl div {
		min-width: 0;
		background: var(--card);
		padding: 0.7rem 1rem;
	}
	dt {
		color: var(--muted-foreground);
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	dd {
		margin-top: 0.18rem;
		overflow-wrap: anywhere;
		font-family: ui-monospace, monospace;
		font-size: 0.72rem;
	}
	.header-actions :global(button) {
		border-radius: 0.65rem;
		background: var(--muted);
		padding: 0.45rem 0.7rem;
		font-size: 0.75rem;
	}

	@media (max-width: 36rem) {
		header,
		.hard-case {
			grid-template-columns: 1fr;
		}
		dl {
			grid-template-columns: 1fr;
		}
	}
</style>
