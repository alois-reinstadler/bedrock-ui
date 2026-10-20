<script lang="ts">
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';

	import { Button } from '#lib/bedrock/ui/button';

	import * as Tooltip from '#lib/bedrock/ui/tooltip';
	import * as Popover from '#lib/bedrock/ui/popover';
	import * as DropdownMenu from '#lib/bedrock/ui/dropdown-menu';
	import * as Select from '#lib/bedrock/ui/select';

	let selectValue = $state('move');
	const placements = ['top', 'right', 'bottom', 'left'] as const;
</script>

<Benchmark
	id="anchored-placements"
	title="Anchored Layers: Position, Ursprung und Kollision"
	summary="Tooltip und Popover öffnen von oben, rechts, unten und links. Dropdown und Select prüfen Tastaturnavigation und konkurrierende Layer."
	hardCase="Unteres Popover nahe der Viewportkante öffnen, Collision-Flip erzwingen und sofort schließen beziehungsweise wieder öffnen. Danach direkt ein zweites Layer öffnen."
	verdict="beobachten"
	finding="Anchored Layers folgen Astryx-Tokens: Popover 200/150 ms, Tooltip 140 ms mit sofortigem Austritt. Bits verwaltet Präsenz und Fokus; CSS interpoliert ohne Zoom."
	metadata={{
		role: 'Eintritt',
		duration: 'Popover 200/150 ms; Tooltip 140 ms / sofort',
		easing: 'Astryx enter / exit',
		distance: '4 px für Popover; Tooltip ohne Translation',
		origin: '--transform-origin, sofern Primitive bereitstellt',
		properties: 'transform, opacity',
		layout: 'Nein',
		loop: 'Nein',
		reduced: 'MotionProvider und OS reduzieren CSS und laufende JS-Bewegung.'
	}}
>
	<div class="placement-grid">
		{#each placements as side (side)}
			<div class="placement-cell">
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}<Button size="sm" variant="outline" {...props}
								>Tooltip {side}</Button
							>{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content {side}>Ursprung: {side}</Tooltip.Content>
				</Tooltip.Root>
				<Popover.Root>
					<Popover.Trigger>
						{#snippet child({ props })}<Button size="sm" {...props}>Popover</Button>{/snippet}
					</Popover.Trigger>
					<Popover.Content {side} align={side === 'left' ? 'end' : 'center'}>
						<Popover.Header
							><Popover.Title>Platzierung {side}</Popover.Title><Popover.Description
								>Mit Kollisionserkennung und Escape schließen.</Popover.Description
							></Popover.Header
						>
					</Popover.Content>
				</Popover.Root>
			</div>
		{/each}
	</div>
	<div class="layer-row">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				>{#snippet child({ props })}<Button variant="outline" {...props}>Dropdown</Button
					>{/snippet}</DropdownMenu.Trigger
			>
			<DropdownMenu.Content
				><DropdownMenu.Label>Motion-Aktion</DropdownMenu.Label><DropdownMenu.Separator
				/><DropdownMenu.Item>Wiederholen</DropdownMenu.Item><DropdownMenu.Item
					>Prüfen</DropdownMenu.Item
				><DropdownMenu.Item disabled>Deaktiviert</DropdownMenu.Item></DropdownMenu.Content
			>
		</DropdownMenu.Root>
		<Select.Root type="single" bind:value={selectValue}>
			<Select.Trigger class="w-44">{selectValue}</Select.Trigger>
			<Select.Content
				>{#each ['press', 'state', 'move', 'overlay'] as value (value)}<Select.Item
						{value}
						label={value}
					/>{/each}</Select.Content
			>
		</Select.Root>
	</div>
</Benchmark>

<style>
	.layer-row {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}
	.layer-row {
		margin-top: 0.75rem;
	}

	.placement-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.55rem;
	}
	.placement-cell {
		display: flex;
		min-height: 5rem;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		border-radius: 0.85rem;
		background: var(--background);
	}
	@media (max-width: 40rem) {
		.placement-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
