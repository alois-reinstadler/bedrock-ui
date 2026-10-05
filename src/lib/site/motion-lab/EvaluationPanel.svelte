<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { rubricDimensions } from './types.js';

	let scores = $state<Record<string, number>>({});
	let total = $derived(rubricDimensions.reduce((sum, [name]) => sum + (scores[name] ?? 0), 0));
	let possible = rubricDimensions.length * 2;
</script>

<section class="rubric" aria-labelledby="motion-rubric-title">
	<header>
		<div>
			<p>Evaluationsraster</p>
			<h2 id="motion-rubric-title">Kohärenz statt Effektmenge</h2>
		</div>
		<output aria-live="polite">{total} / {possible}</output>
	</header>
	<div class="dimensions">
		{#each rubricDimensions as [name, question] (name)}
			<div class="dimension">
				<div><strong>{name}</strong><span>{question}</span></div>
				<div class="score" role="group" aria-label={`${name} bewerten`}>
					{#each [0, 1, 2] as value (value)}
						<Button
							variant="ghost"
							class={['control-site-motion-lab-evaluationpanel h-auto whitespace-normal']}
							type="button"
							aria-pressed={(scores[name] ?? 0) === value}
							onclick={() => (scores[name] = value)}>{value}</Button
						>
					{/each}
				</div>
			</div>
		{/each}
	</div>
	<p class="note">
		0 = nicht erfüllt · 1 = teilweise · 2 = kohärent. Ein hoher Wert ersetzt keine Untersuchung der
		Härtefälle.
	</p>
</section>

<style>
	.rubric {
		border: 1px solid var(--border);
		border-radius: 1.35rem;
		background: var(--card);
		padding: clamp(1rem, 3vw, 1.5rem);
	}
	header {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 1rem;
	}
	header p {
		color: var(--muted-foreground);
		font-size: 0.7rem;
		font-weight: 650;
		letter-spacing: 0.11em;
		text-transform: uppercase;
	}
	h2 {
		margin-top: 0.2rem;
		font-size: 1.25rem;
		font-weight: 680;
	}
	output {
		font-variant-numeric: tabular-nums;
		color: var(--muted-foreground);
		font-size: 0.85rem;
	}
	.dimensions {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1px;
		margin-top: 1rem;
		overflow: hidden;
		border: 1px solid var(--border);
		border-radius: 0.9rem;
		background: var(--border);
	}
	.dimension {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		background: var(--card);
		padding: 0.75rem;
	}
	.dimension strong,
	.dimension span {
		display: block;
	}
	.dimension strong {
		font-size: 0.78rem;
	}
	.dimension span {
		margin-top: 0.15rem;
		color: var(--muted-foreground);
		font-size: 0.68rem;
		line-height: 1.35;
	}
	.score {
		display: flex;
		flex: none;
		gap: 0.2rem;
	}
	.score :global(button.control-site-motion-lab-evaluationpanel) {
		display: grid;
		width: 1.65rem;
		height: 1.65rem;
		place-items: center;
		border-radius: 0.45rem;
		background: var(--muted);
		color: var(--muted-foreground);
		font-size: 0.7rem;
	}
	.score :global(button.control-site-motion-lab-evaluationpanel[aria-pressed='true']) {
		background: var(--foreground);
		color: var(--background);
	}
	.note {
		margin-top: 0.75rem;
		color: var(--muted-foreground);
		font-size: 0.7rem;
	}

	@media (max-width: 48rem) {
		.dimensions {
			grid-template-columns: 1fr;
		}
	}
</style>
