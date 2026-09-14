<script lang="ts">
	import { createLayout } from '#lib/bedrock/motion/engine.js';
	import { Motion } from '#lib/bedrock/motion/css.js';

	let count = $state(50);
	let reverse = $state(false);
	let dense = $state(false);
	let selected = $state<number | null>(null);
	const items = $derived(
		Array.from({ length: count }, (_, index) => (reverse ? count - index : index + 1))
	);
	const project = createLayout({ transition: { type: 'spring', stiffness: 420, damping: 38 } });
	const position = project({ mode: 'position' });
</script>

<section aria-label="Astra projection stress test" class="stress-fixture">
	<p>
		Reorder up to 100 persistent nodes. Astra JavaScript projects layout changes; Astra CSS handles
		selection feedback. Reduced motion follows your system preference.
	</p>
	<div class="controls">
		<label
			>Participants <select bind:value={count}
				><option value={50}>50</option><option value={100}>100</option></select
			></label
		>
		<button type="button" onclick={() => (reverse = !reverse)}>Reverse order</button>
		<button type="button" aria-pressed={dense} onclick={() => (dense = !dense)}>Compact grid</button
		>
	</div>
	<p role="status">
		{count} participants · {selected === null ? 'No selection' : `Selected signal ${selected}`}
	</p>
	<div class="grid" class:dense data-testid="stress-grid">
		{#each items as id (id)}
			<div {@attach position}>
				<Motion
					as="button"
					type="button"
					aria-pressed={selected === id}
					onclick={() => (selected = selected === id ? null : id)}
					motion={{
						initial: false,
						animate: { opacity: selected === null || selected === id ? 1 : 0.55 },
						whileHover: { scale: 1.04 },
						whileTap: { scale: 0.97 },
						transition: { duration: 0.16 }
					}}>Signal {id}</Motion
				>
			</div>
		{/each}
	</div>
</section>

<style>
	.stress-fixture {
		display: grid;
		gap: 1rem;
		max-width: 70rem;
		margin: auto;
	}
	p {
		color: var(--muted-foreground);
		line-height: 1.6;
	}
	.controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
	}
	label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.controls button,
	select {
		padding: 0.65rem 0.9rem;
		border: 1px solid var(--border);
		border-radius: 0.65rem;
		background: var(--background);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
		gap: 0.6rem;
	}
	.grid.dense {
		grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
	}
	.grid :global(button) {
		width: 100%;
		min-height: 3.5rem;
		border-radius: 0.7rem;
		background: var(--muted);
		padding: 0.5rem;
	}
	.grid :global(button[aria-pressed='true']) {
		background: var(--foreground);
		color: var(--background);
	}
	:global(.stress-fixture button:focus-visible),
	select:focus-visible {
		outline: 2px solid var(--ring);
		outline-offset: 3px;
	}
</style>
