<script lang="ts">
	import MoreHorizontalIcon from '@lucide/svelte/icons/ellipsis';
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';
	import { useMotionLabState } from '#lib/site/motion-lab/context.svelte.js';
	import { Button } from '#lib/bedrock/ui/button';
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	import { Switch } from '#lib/bedrock/ui/switch';
	import { Slider } from '#lib/bedrock/ui/slider';
	import * as RadioGroup from '#lib/bedrock/ui/radio-group';
	import * as ToggleGroup from '#lib/bedrock/ui/toggle-group';

	const lab = useMotionLabState();
	let switchChecked = $state(false);
	let checkboxChecked = $state(false);
	let sliderValue = $state(42);
	let radioValue = $state('eins');
	let toggleValue = $state<string[]>(['layout']);
	function rapidSwitch() {
		let remaining = lab.stressMode === 'rapid' ? 8 : 4;
		const step = () => {
			switchChecked = !switchChecked;
			remaining -= 1;
			if (remaining > 0) window.setTimeout(step, 45);
		};
		step();
	}
</script>

<Benchmark
	id="control-states"
	title="Controls: Feedback, Auswahl und direkte Eingabe"
	summary="Button, IconButton, Toggle-Gruppe, Checkbox, Radio, Switch und Slider in einem häufig genutzten Kontrollfeld."
	hardCase="Switch achtmal schnell umschalten, per Leertaste aktivieren und danach 30 Controls gleichzeitig aktualisieren. Der Thumb darf nicht in einer veralteten Position enden."
	verdict="beobachten"
	finding="Button und Switch verwenden transition-all statt des press/state-Vokabulars. Checkbox-Indikator und Slider-Drag sind zu Recht praktisch instant."
	metadata={{
		role: 'Press / unmittelbares Feedback',
		duration: 'Tailwind default; Bedrock press/state nicht konsumiert',
		easing: 'Tailwind default',
		distance: 'Button active: 1 px; Switch thumb: 14 px',
		properties: 'transition-all / transform / color / shadow',
		layout: 'Nein',
		loop: 'Nein',
		reduced: 'Komponenten besitzen keine gemeinsame Reduced-Motion-Policy.'
	}}
>
	{#snippet actions()}<Button size="sm" variant="outline" onclick={rapidSwitch}
			>Schnell toggeln</Button
		>{/snippet}
	<div class="control-grid">
		<div class="control-cell">
			<span>Button / IconButton</span>
			<div class="row">
				<Button>Speichern</Button>
				<Button size="icon" variant="outline" aria-label="Weitere Aktionen"
					><MoreHorizontalIcon /></Button
				>
				<Button disabled>Deaktiviert</Button>
			</div>
		</div>
		<div class="control-cell">
			<span>ToggleButton / Segmented</span>
			<ToggleGroup.Root
				type="multiple"
				value={toggleValue}
				onValueChange={(value) => (toggleValue = value)}
			>
				<ToggleGroup.Item value="layout">Layout</ToggleGroup.Item>
				<ToggleGroup.Item value="motion">Motion</ToggleGroup.Item>
				<ToggleGroup.Item value="a11y">A11y</ToggleGroup.Item>
			</ToggleGroup.Root>
		</div>
		<label class="control-cell inline-control">
			<Checkbox bind:checked={checkboxChecked} />
			<span>Checkbox {checkboxChecked ? 'aktiv' : 'inaktiv'}</span>
		</label>
		<label class="control-cell inline-control">
			<Switch bind:checked={switchChecked} />
			<span>Switch {switchChecked ? 'aktiv' : 'inaktiv'}</span>
		</label>
		<div class="control-cell">
			<span>Radio</span>
			<RadioGroup.Root
				value={radioValue}
				onValueChange={(value) => (radioValue = value)}
				class="row"
			>
				{#each ['eins', 'zwei', 'drei'] as value (value)}
					<label class="radio"><RadioGroup.Item {value} /> {value}</label>
				{/each}
			</RadioGroup.Root>
		</div>
		<div class="control-cell">
			<span>Slider · {sliderValue}</span>
			<Slider type="single" min={0} max={100} bind:value={sliderValue} />
		</div>
	</div>
</Benchmark>

<style>
	.control-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.6rem;
	}
	.control-cell {
		display: grid;
		align-content: center;
		gap: 0.55rem;
		min-height: 5rem;
		border-radius: 0.85rem;
		background: var(--background);
		padding: 0.8rem;
	}
	.control-cell > span {
		color: var(--muted-foreground);
		font-size: 0.68rem;
	}
	.control-cell.inline-control {
		display: flex;
		align-items: center;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}

	.radio {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.7rem;
	}

	@media (max-width: 40rem) {
		.control-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
