<script lang="ts">
	import { useMotionLabState } from './context.svelte.js';

	const state = useMotionLabState();
	const speeds = [1, 2, 4, 8] as const;
</script>

<aside class="rail" aria-label="Globale Motion-Lab-Steuerung">
	<div class="rail-heading">
		<div>
			<p class="eyebrow">Inspektionsmodus</p>
			<h2>Motion-Steuerung</h2>
		</div>
		<span class="status" data-active={state.preference === 'reduced'}>
			{state.preference === 'reduced' ? 'Reduziert' : 'Normal'}
		</span>
	</div>

	<p class="scope-note">
		Slow motion and pause affect CSS probes. Reduced motion also controls Astra projection; Normal
		respects your system preference.
	</p>
	<fieldset>
		<legend>Zeitlupe</legend>
		<div class="options compact">
			{#each speeds as speed (speed)}
				<button
					type="button"
					aria-pressed={state.timeScale === speed}
					aria-label={speed === 1 ? 'Echtzeit' : `${speed}-fache Zeitlupe`}
					onclick={() => (state.timeScale = speed)}>{speed}×</button
				>
			{/each}
		</div>
	</fieldset>

	<fieldset>
		<legend>Bewegungspräferenz</legend>
		<div class="options">
			<button
				type="button"
				aria-pressed={state.preference === 'normal'}
				onclick={() => (state.preference = 'normal')}>Normal</button
			>
			<button
				type="button"
				aria-pressed={state.preference === 'reduced'}
				onclick={() => (state.preference = 'reduced')}>Reduziert</button
			>
		</div>
	</fieldset>

	<fieldset>
		<legend>Eingabe</legend>
		<div class="options compact">
			{#each [['pointer', 'Pointer'], ['keyboard', 'Tastatur'], ['touch', 'Touch']] as option (option[0])}
				<button
					type="button"
					aria-pressed={state.inputMode === option[0]}
					onclick={() => (state.inputMode = option[0] as typeof state.inputMode)}
					>{option[1]}</button
				>
			{/each}
		</div>
	</fieldset>

	<fieldset>
		<legend>Last</legend>
		<div class="options compact">
			{#each [['normal', 'Normal'], ['rapid', 'Schnell'], ['many', 'Viele']] as option (option[0])}
				<button
					type="button"
					aria-pressed={state.stressMode === option[0]}
					onclick={() => (state.stressMode = option[0] as typeof state.stressMode)}
					>{option[1]}</button
				>
			{/each}
		</div>
	</fieldset>

	<div class="actions">
		<button type="button" onclick={() => (state.paused = !state.paused)}>
			{state.paused ? 'Fortsetzen' : 'Pause'}
		</button>
		<button type="button" onclick={() => state.replay()}>Wiederholen</button>
		<button type="button" onclick={() => state.reset()}>Zurücksetzen</button>
	</div>
</aside>

<style>
	.scope-note {
		font-size: 0.72rem;
		line-height: 1.5;
		color: var(--muted-foreground);
	}
	.rail {
		position: sticky;
		top: 4.5rem;
		z-index: 30;
		display: grid;
		gap: 0.8rem;
		border: 1px solid color-mix(in oklab, var(--border), transparent 15%);
		border-radius: 1.25rem;
		background: color-mix(in oklab, var(--background), transparent 6%);
		padding: 1rem;
		box-shadow: 0 18px 50px -38px rgb(0 0 0 / 0.45);
		backdrop-filter: blur(18px);
	}

	.rail-heading {
		display: flex;
		align-items: start;
		justify-content: space-between;
		gap: 1rem;
	}
	.eyebrow,
	legend {
		color: var(--muted-foreground);
		font-size: 0.68rem;
		font-weight: 650;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}
	h2 {
		margin-top: 0.15rem;
		font-size: 0.95rem;
		font-weight: 650;
	}
	.status {
		border-radius: 999px;
		background: var(--muted);
		padding: 0.25rem 0.5rem;
		color: var(--muted-foreground);
		font-size: 0.68rem;
	}
	.status[data-active='true'] {
		background: color-mix(in oklab, #f59e0b, transparent 82%);
		color: #9a5b00;
	}
	fieldset {
		min-width: 0;
	}
	legend {
		margin-bottom: 0.35rem;
	}
	.options {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.3rem;
	}
	.options.compact {
		grid-template-columns: repeat(auto-fit, minmax(3.2rem, 1fr));
	}
	button {
		min-height: 2rem;
		border-radius: 0.6rem;
		background: var(--muted);
		padding: 0.35rem 0.55rem;
		color: var(--muted-foreground);
		font-size: 0.75rem;
		font-weight: 580;
	}
	button:hover {
		color: var(--foreground);
	}
	button:focus-visible {
		outline: 2px solid var(--ring);
		outline-offset: 2px;
	}
	button[aria-pressed='true'] {
		background: var(--foreground);
		color: var(--background);
	}
	.actions {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.3rem;
		border-top: 1px solid var(--border);
		padding-top: 0.8rem;
	}
	.actions button {
		background: transparent;
		padding-inline: 0.3rem;
	}

	@media (max-width: 63.99rem) {
		.rail {
			position: relative;
			top: auto;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
		.rail-heading,
		.actions {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 40rem) {
		.rail {
			grid-template-columns: 1fr;
		}
		.rail-heading,
		.actions {
			grid-column: auto;
		}
	}
</style>
