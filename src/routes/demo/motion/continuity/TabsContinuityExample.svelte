<script lang="ts">
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';
	import { LayoutGroup, layout, motionPresets } from '#lib/bedrock/motion/index.js';
	import { Button } from '#lib/bedrock/ui/button';

	import * as Tabs from '#lib/bedrock/ui/tabs';

	const tabItems = [
		['signal', 'Signal'],
		['operations', 'Betrieb & Einsatzplanung'],
		['load', 'Last'],
		['accessibility', 'Barrierefreiheit'],
		['report', 'Abschlussbericht mit langem Titel']
	] as const;
	let activeTab = $state('signal');
	let dynamicLabel = $state(false);
	const indicator = layout({ transition: motionPresets.swap });
	function chooseTab(value: string) {
		activeTab = value;
	}
</script>

<Benchmark
	id="tabs-continuity"
	title="Tabs mit ungleichen Breiten"
	summary="Oben: die ausgelieferte Tabs-Komponente mit pro-Trigger-Opacity. Unten: dieselben Ziele mit Bedrocks persistentem Layout-Indikator."
	hardCase="Tab 1 → 5 → 2 vor Abschluss, danach Tastaturdurchlauf. Den längsten Labeltext dynamisch ändern und einen deaktivierten Tab überspringen."
	verdict="problem"
	finding="Die ausgelieferte Tabs-Komponente blendet einen Pseudo-Indikator aus und ein. Kontinuität ist mit der vorhandenen Layout-Engine möglich, aber nicht als Tabs-Primitive integriert."
	metadata={{
		role: 'Bewegung / Kontinuität',
		duration: 'Shipped: Tailwind default · Probe: motionPresets.swap 400 ms',
		easing: 'Shipped: opacity default · Probe: swap spring 183/23/1',
		distance: 'zwischen ungleichen Triggerboxen',
		properties: 'opacity beziehungsweise transform + size projection',
		layout: 'Einmalige Messung',
		loop: 'Nein',
		reduced: 'Indikator springt sofort; Text-, Fokus- und Auswahlzustand bleiben sichtbar.'
	}}
>
	{#snippet actions()}<Button
			size="sm"
			variant="outline"
			onclick={() => (dynamicLabel = !dynamicLabel)}>Label ändern</Button
		>{/snippet}
	<div class="comparison-label">Ausgelieferte Komponente</div>
	<Tabs.Root bind:value={activeTab}>
		<Tabs.List variant="line" class="w-full justify-start overflow-x-auto">
			{#each tabItems as [value, label], index (value)}
				<Tabs.Trigger {value} disabled={index === 2} class="flex-none px-3"
					>{value === 'operations' && dynamicLabel ? `${label} · erweitert` : label}</Tabs.Trigger
				>
			{/each}
		</Tabs.List>
	</Tabs.Root>

	<div class="comparison-label">Kontinuitätsprobe mit bestehender Layout-Primitive</div>
	<LayoutGroup class="continuity-tabs">
		{#each tabItems as [value, label], index (value)}
			<button
				type="button"
				disabled={index === 2}
				aria-pressed={activeTab === value}
				onclick={() => chooseTab(value)}
			>
				{#if activeTab === value}<span
						{@attach indicator}
						class="moving-indicator"
						aria-hidden="true"
					></span>{/if}
				<strong>{value === 'operations' && dynamicLabel ? `${label} · erweitert` : label}</strong>
			</button>
		{/each}
	</LayoutGroup>
</Benchmark>

<style>
	.comparison-label {
		margin: 0.9rem 0 0.45rem;
		color: var(--muted-foreground);
		font-size: 0.64rem;
		font-weight: 650;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.comparison-label:first-child {
		margin-top: 0;
	}
	:global(.continuity-tabs) {
		display: flex;
		align-items: stretch;
		gap: 0.25rem;
		overflow-x: auto;
		border-radius: 0.8rem;
		background: var(--background);
		padding: 0.3rem;
	}
	:global(.continuity-tabs button) {
		position: relative;
		flex: none;
		overflow: hidden;
		border-radius: 0.6rem;
		padding: 0.55rem 0.75rem;
		color: var(--muted-foreground);
		font-size: 0.72rem;
	}
	:global(.continuity-tabs button:disabled) {
		opacity: 0.35;
	}
	:global(.continuity-tabs button strong) {
		position: relative;
		z-index: 1;
		font-weight: 580;
	}
	:global(.continuity-tabs button[aria-pressed='true']) {
		color: var(--background);
	}
	.moving-indicator {
		position: absolute;
		inset: 0;
		border-radius: 0.6rem;
		background: var(--foreground);
	}
</style>
