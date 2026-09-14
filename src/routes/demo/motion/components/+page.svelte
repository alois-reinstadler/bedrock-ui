<script lang="ts">
	import { onDestroy } from 'svelte';
	import CheckIcon from '@lucide/svelte/icons/check';
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';
	import MoreHorizontalIcon from '@lucide/svelte/icons/ellipsis';
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';
	import { useMotionLabState } from '#lib/site/motion-lab/context.svelte.js';
	import { Button } from '#lib/bedrock/ui/button';
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	import { Switch } from '#lib/bedrock/ui/switch';
	import { Slider } from '#lib/bedrock/ui/slider';
	import * as RadioGroup from '#lib/bedrock/ui/radio-group';
	import * as ToggleGroup from '#lib/bedrock/ui/toggle-group';
	import * as Tooltip from '#lib/bedrock/ui/tooltip';
	import * as Popover from '#lib/bedrock/ui/popover';
	import * as DropdownMenu from '#lib/bedrock/ui/dropdown-menu';
	import * as Select from '#lib/bedrock/ui/select';
	import * as Dialog from '#lib/bedrock/ui/dialog';
	import * as AlertDialog from '#lib/bedrock/ui/alert-dialog';
	import * as Sheet from '#lib/bedrock/ui/sheet';
	import * as Drawer from '#lib/bedrock/ui/drawer';

	const lab = useMotionLabState();
	let switchChecked = $state(false);
	let checkboxChecked = $state(false);
	let sliderValue = $state(42);
	let radioValue = $state('eins');
	let toggleValue = $state<string[]>(['layout']);
	let manyControls = $state(Array.from({ length: 30 }, (_, index) => index % 3 === 0));
	let loadingState = $state<'idle' | 'loading' | 'done'>('idle');
	let selectValue = $state('move');
	let loadingTimer = 0;

	const placements = ['top', 'right', 'bottom', 'left'] as const;

	function toggleMany() {
		manyControls = manyControls.map((value) => !value);
	}

	function rapidSwitch() {
		let remaining = lab.stressMode === 'rapid' ? 8 : 4;
		const step = () => {
			switchChecked = !switchChecked;
			remaining -= 1;
			if (remaining > 0) window.setTimeout(step, 45);
		};
		step();
	}

	function startLoading() {
		clearTimeout(loadingTimer);
		loadingState = 'loading';
		loadingTimer = window.setTimeout(() => (loadingState = 'done'), 900);
	}

	onDestroy(() => clearTimeout(loadingTimer));
</script>

<div class="page-stack">
	<header class="page-heading">
		<p>02 · Komponenten</p>
		<h2>Häufige Aktionen dürfen nicht ermüden</h2>
		<span
			>Reale Bedrock-Komponenten zeigen ihre vorhandenen Utility-Animationen. Die Metadaten
			beschreiben den Ist-Zustand, nicht die gewünschte Zukunft.</span
		>
	</header>

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

	<Benchmark
		id="many-controls"
		title="30 gleichzeitige Zustandswechsel"
		summary="Select all aktualisiert echte Switches in einem Frame. Das entlarvt unnötige Bewegung und breite Transition-Claims."
		hardCase="Alle 30 umschalten, sofort erneut umschalten und während der Thumb-Transitions per Tastatur einen einzelnen Switch ändern."
		verdict="problem"
		finding="Jeder Switch animiert transition-all und zusätzlich transform am Thumb. Unter hoher Frequenz ist ein kürzerer oder praktisch sofortiger Zustandswechsel wahrscheinlich besser."
		metadata={{
			role: 'Zustandswechsel',
			duration: 'Tailwind default × 30',
			easing: 'Tailwind default',
			distance: '14 px Thumb',
			properties: 'background, border, transform; transition-all am Root',
			layout: 'Nein',
			loop: 'Nein',
			reduced: 'Lab-Override kürzt auf 80 ms; Bibliothek selbst tut dies noch nicht.'
		}}
	>
		{#snippet actions()}<Button size="sm" onclick={toggleMany}>Alle umschalten</Button>{/snippet}
		<div class="switch-matrix">
			{#each manyControls as checked, index (index)}
				<label data-checked={checked}
					><Switch bind:checked={manyControls[index]} size="sm" /><span
						>{String(index + 1).padStart(2, '0')}</span
					></label
				>
			{/each}
		</div>
	</Benchmark>

	<Benchmark
		id="async-control"
		title="Asynchroner Button ohne Größenflackern"
		summary="Idle → Loading → Erfolg innerhalb einer stabilen 9.5-rem-Fläche. Eine neue Anfrage darf Erfolg sofort unterbrechen."
		hardCase="Während Erfolg sichtbar wird, sofort erneut starten. Icon und Text wechseln, aber die Button-Geometrie bleibt unverändert."
		verdict="beobachten"
		metadata={{
			role: 'Zustandswechsel',
			duration: 'Astra CSS finite state transition',
			easing: 'nicht semantisch gebunden',
			properties: 'color, transform; Spinner-Schleife',
			layout: 'Nein',
			loop: 'Ja',
			reduced: 'Spinner sollte zu statischem Statussymbol werden.'
		}}
	>
		<div class="async-stage">
			<Button class="w-40" onclick={startLoading} disabled={loadingState === 'loading'}>
				{#if loadingState === 'loading'}<LoaderCircleIcon class="lab-loop animate-spin" /> Wird geprüft
					…
				{:else if loadingState === 'done'}<CheckIcon /> Erfolgreich
				{:else}Prüfung starten{/if}
			</Button>
			<Button variant="outline" onclick={startLoading}>Neu starten</Button>
		</div>
	</Benchmark>

	<Benchmark
		id="anchored-placements"
		title="Anchored Layers: Position, Ursprung und Kollision"
		summary="Tooltip und Popover öffnen von oben, rechts, unten und links. Dropdown und Select prüfen Tastaturnavigation und konkurrierende Layer."
		hardCase="Unteres Popover nahe der Viewportkante öffnen, Collision-Flip erzwingen und sofort schließen beziehungsweise wieder öffnen. Danach direkt ein zweites Layer öffnen."
		verdict="problem"
		finding="Anchored Layers verwenden einheitlich generische 100-ms-Fade/Zoom/Slide-Utilities, aber nicht Bedrocks enter/exit-Tokens. Transform-Ursprung ist nur in Teilen konsistent."
		metadata={{
			role: 'Eintritt',
			duration: 'duration-100 (Eintritt und Austritt)',
			easing: 'tw-animate-css default',
			distance: '0.5rem placement slide; scale 0.95',
			origin: '--transform-origin, sofern Primitive bereitstellt',
			properties: 'transform, opacity',
			layout: 'Nein',
			loop: 'Nein',
			reduced: 'Keine bibliotheksweite Regel; Lab entfernt Translation/Scale.'
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

	<Benchmark
		id="dialog-surfaces"
		title="Dialog und Alert Dialog"
		summary="Backdrop, Inhalt, Escape, Fokus-Rückgabe und explizite Bestätigung mit realen Komponenten."
		hardCase="Dialog öffnen, vor Abschluss mit Escape schließen und sofort erneut öffnen. Fokus muss zum Trigger zurückkehren; kein altes Outro darf den neuen Inhalt entfernen."
		verdict="problem"
		finding="Dialog und Backdrop teilen symmetrische 100 ms. Das ist schneller als ein kleines Popover nicht langsamer – visuelles Gewicht wird nicht abgebildet."
		metadata={{
			role: 'Overlay / große Fläche',
			duration: 'duration-100; semantischer overlay-Token wäre 410 ms',
			easing: 'tw-animate-css default',
			distance: 'scale 0.95',
			origin: 'Mitte',
			properties: 'transform, opacity, backdrop-filter',
			layout: 'Nein',
			loop: 'Nein',
			reduced: 'Lab entfernt Scale; Bibliothek hat keine zentrale Alternative.'
		}}
	>
		<div class="layer-row">
			<Dialog.Root>
				<Dialog.Trigger
					>{#snippet child({ props })}<Button {...props}>Dialog öffnen</Button
						>{/snippet}</Dialog.Trigger
				>
				<Dialog.Content
					><Dialog.Header
						><Dialog.Title>Motion-Prüfung</Dialog.Title><Dialog.Description
							>Escape, Außenklick und Fokus-Rückgabe prüfen.</Dialog.Description
						></Dialog.Header
					><Dialog.Footer
						><Dialog.Close
							>{#snippet child({ props })}<Button variant="outline" {...props}>Schließen</Button
								>{/snippet}</Dialog.Close
						><Button>Bestätigen</Button></Dialog.Footer
					></Dialog.Content
				>
			</Dialog.Root>
			<AlertDialog.Root>
				<AlertDialog.Trigger
					>{#snippet child({ props })}<Button variant="destructive" {...props}>Alert öffnen</Button
						>{/snippet}</AlertDialog.Trigger
				>
				<AlertDialog.Content
					><AlertDialog.Header
						><AlertDialog.Title>Test zurücksetzen?</AlertDialog.Title><AlertDialog.Description
							>Diese Fläche verlangt eine explizite Entscheidung.</AlertDialog.Description
						></AlertDialog.Header
					><AlertDialog.Footer
						><AlertDialog.Cancel>Abbrechen</AlertDialog.Cancel><AlertDialog.Action
							>Zurücksetzen</AlertDialog.Action
						></AlertDialog.Footer
					></AlertDialog.Content
				>
			</AlertDialog.Root>
		</div>
	</Benchmark>

	<Benchmark
		id="edge-surfaces"
		title="Sheet und gestischer Drawer"
		summary="Sheets aus vier Kanten und ein Vaul-Drawer machen unterschiedliche Motion-Eigentümer sichtbar."
		hardCase="Fläche halb öffnen, schließen und vor Ende erneut öffnen. Beim Drawer während des Settlings erneut greifen; beim Sheet die Kante wechseln."
		verdict="problem"
		finding="Sheet nutzt 200 ms ease-in-out, Drawer besitzt extern 500 ms und persistentes will-change. Beide umgehen Bedrocks overlay/drawer-Token und Reduced-Motion-Policy."
		metadata={{
			role: 'Overlay / große Fläche',
			duration: 'Sheet 200 ms · Drawer extern 500 ms',
			easing: 'ease-in-out · Vaul intern',
			distance: 'Kantenbezogen / volle Drawer-Reise',
			origin: 'gewählte Kante',
			properties: 'transform, opacity, backdrop-filter',
			layout: 'Nein',
			loop: 'Nein',
			reduced: 'Lab-Override erreicht portalisierte Third-Party-Flächen nicht zuverlässig.'
		}}
	>
		<div class="layer-row wrap">
			{#each placements as side (side)}
				<Sheet.Root>
					<Sheet.Trigger
						>{#snippet child({ props })}<Button size="sm" variant="outline" {...props}
								>Sheet {side}</Button
							>{/snippet}</Sheet.Trigger
					>
					<Sheet.Content {side}
						><Sheet.Header
							><Sheet.Title>Sheet von {side}</Sheet.Title><Sheet.Description
								>Richtung, Dauer und Backdrop-Timing prüfen.</Sheet.Description
							></Sheet.Header
						></Sheet.Content
					>
				</Sheet.Root>
			{/each}
			<Drawer.Root>
				<Drawer.Trigger
					>{#snippet child({ props })}<Button size="sm" {...props}>Bottom Drawer</Button
						>{/snippet}</Drawer.Trigger
				>
				<Drawer.Content
					><Drawer.Header
						><Drawer.Title>Gestischer Drawer</Drawer.Title><Drawer.Description
							>Ziehen, loslassen und während des Settlings wieder greifen.</Drawer.Description
						></Drawer.Header
					><Drawer.Footer
						><Drawer.Close
							>{#snippet child({ props })}<Button variant="outline" {...props}>Schließen</Button
								>{/snippet}</Drawer.Close
						></Drawer.Footer
					></Drawer.Content
				>
			</Drawer.Root>
		</div>
	</Benchmark>
</div>

<style>
	.page-stack {
		display: grid;
		gap: 1.25rem;
	}
	.page-heading {
		padding: 0.5rem 0 0.75rem;
	}
	.page-heading p {
		color: var(--muted-foreground);
		font-size: 0.7rem;
		font-weight: 650;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}
	.page-heading h2 {
		margin-top: 0.3rem;
		max-width: 24ch;
		font-size: clamp(1.8rem, 4vw, 3.2rem);
		font-weight: 660;
		letter-spacing: -0.045em;
		line-height: 1;
	}
	.page-heading span {
		display: block;
		max-width: 65ch;
		margin-top: 0.75rem;
		color: var(--muted-foreground);
		font-size: 0.86rem;
		line-height: 1.55;
	}
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
	.row,
	.layer-row {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}
	.layer-row {
		margin-top: 0.75rem;
	}
	.layer-row.wrap {
		flex-wrap: wrap;
	}
	.radio {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.7rem;
	}
	.switch-matrix {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(4.3rem, 1fr));
		gap: 0.35rem;
	}
	.switch-matrix label {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.4rem;
		border-radius: 0.65rem;
		background: var(--background);
		padding: 0.55rem;
	}
	.switch-matrix span {
		color: var(--muted-foreground);
		font-family: ui-monospace, monospace;
		font-size: 0.6rem;
	}
	.async-stage {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		min-height: 5rem;
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
		.control-grid,
		.placement-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
