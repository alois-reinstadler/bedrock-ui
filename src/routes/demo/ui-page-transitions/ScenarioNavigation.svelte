<script lang="ts">
	import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';

	import { scenarios, type Scenario, type ScenarioId } from './scenarios';
	let {
		active,
		activeScenario,
		transitionActive,
		selectScenario
	}: {
		active: ScenarioId;
		activeScenario: Scenario;
		transitionActive: boolean;
		selectScenario: (id: ScenarioId) => void;
	} = $props();
</script>

<aside class="scenario-panel">
	<div class="scenario-heading">
		<span>Szenarien</span>
		<span>{activeScenario.index} / 04</span>
	</div>
	<nav aria-label="Übergangsszenarien">
		{#each scenarios as scenario (scenario.id)}
			<button
				type="button"
				class={[{ active: active === scenario.id }]}
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

<style>
	.scenario-heading,
	.scenario-note p {
		font-size: 0.64rem;
		font-weight: 650;
		letter-spacing: 0.12em;
		text-transform: uppercase;
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

	@media (max-width: 900px) {
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
		.scenario-note {
			display: none;
		}
	}
	@media (max-width: 640px) {
		.scenario-panel nav {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
