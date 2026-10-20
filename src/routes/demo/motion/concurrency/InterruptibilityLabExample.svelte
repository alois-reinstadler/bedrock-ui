<script lang="ts">
	import { onDestroy } from 'svelte';

	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';

	import { Button } from '#lib/bedrock/ui/button';

	import { Switch } from '#lib/bedrock/ui/switch';
	import * as Accordion from '#lib/bedrock/ui/accordion';
	import * as Dialog from '#lib/bedrock/ui/dialog';

	let interruptTarget = $state<'a' | 'b' | 'c'>('a');
	let interruptRunning = $state(false);
	let interruptTimers: number[] = [];
	let interruptSwitch = $state(false);
	let interruptAccordion = $state('');
	function runInterruptSequence() {
		for (const timer of interruptTimers) clearTimeout(timer);
		interruptTimers = [];
		interruptRunning = true;
		const sequence: Array<['a' | 'b' | 'c', number]> = [
			['b', 0],
			['a', 90],
			['c', 165],
			['a', 245],
			['b', 320]
		];
		for (const [target, delay] of sequence) {
			interruptTimers.push(
				window.setTimeout(() => {
					interruptTarget = target;
					interruptSwitch = target !== 'a';
					interruptAccordion = target === 'c' ? 'details' : '';
				}, delay)
			);
		}
		interruptTimers.push(window.setTimeout(() => (interruptRunning = false), 900));
	}
	onDestroy(() => {
		for (const timer of interruptTimers) clearTimeout(timer);
	});
</script>

<Benchmark
	id="interruptibility-lab"
	title="Interruptibility Lab: A → B → A → C → A → B"
	summary="Die Sequenz retargetet einen einfachen Indikator, einen Switch und ein Accordion in Intervallen unterhalb ihrer Motion-Dauer."
	hardCase="Neue Ziele alle 75–90 ms setzen. Der Indikator startet vom sichtbaren Zwischenstand; Switch und Accordion dürfen keine stale queued Animation beenden."
	verdict="beobachten"
	finding="CSS-Transition und Bedrock-Layout können vom sichtbaren Zustand retargeten. Keyframe-basierte Komponenten wie Dialog/Accordion müssen pro Komponente geprüft werden und starten häufig ihre authored Animation neu."
	metadata={{
		role: 'Bewegung / Kontinuität',
		duration: 'state 175 · reveal 310 · layout 500 ms',
		easing: 'move / component defaults',
		distance: 'A 0% · B 50% · C 100%',
		properties: 'transform, height, component state',
		layout: 'Pro Frame',
		loop: 'Nein',
		reduced: 'Ziele werden sofort gesetzt; finale Zustände bleiben korrekt.'
	}}
>
	{#snippet actions()}<Button size="sm" onclick={runInterruptSequence} disabled={interruptRunning}
			>{interruptRunning ? 'Sequenz läuft' : 'Stress-Sequenz'}</Button
		>{/snippet}
	<div class="interrupt-track" data-target={interruptTarget}>
		<i class="lab-spatial"></i><span>A</span><span>B</span><span>C</span>
	</div>
	<div class="interrupt-components">
		<label
			><Switch bind:checked={interruptSwitch} /><span>Switch {interruptSwitch ? 'B/C' : 'A'}</span
			></label
		>
		<Accordion.Root type="single" bind:value={interruptAccordion}
			><Accordion.Item value="details"
				><Accordion.Trigger>Accordion Ziel C</Accordion.Trigger><Accordion.Content
					>Diese Offenlegung wird vor Abschluss wieder geschlossen.</Accordion.Content
				></Accordion.Item
			></Accordion.Root
		>
		<Dialog.Root
			><Dialog.Trigger
				>{#snippet child({ props })}<Button variant="outline" size="sm" {...props}
						>Dialog manuell reversen</Button
					>{/snippet}</Dialog.Trigger
			><Dialog.Content
				><Dialog.Header
					><Dialog.Title>Reversal-Probe</Dialog.Title><Dialog.Description
						>Mit Escape schließen und vor Ende erneut öffnen.</Dialog.Description
					></Dialog.Header
				></Dialog.Content
			></Dialog.Root
		>
	</div>
</Benchmark>

<style>
	.interrupt-track {
		position: relative;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		height: 4rem;
		align-items: end;
		border-radius: 0.8rem;
		background: var(--background);
		padding: 0.6rem;
	}
	.interrupt-track i {
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;
		width: calc((100% - 1rem) / 3);
		height: 2rem;
		border-radius: 0.6rem;
		background: var(--foreground);
		transition: transform var(--motion-layout) var(--ease-move);
	}
	.interrupt-track[data-target='b'] i {
		transform: translateX(100%);
	}
	.interrupt-track[data-target='c'] i {
		transform: translateX(200%);
	}
	.interrupt-track span {
		text-align: center;
		color: var(--muted-foreground);
		font-family: ui-monospace, monospace;
		font-size: 0.62rem;
	}
	.interrupt-components {
		display: grid;
		grid-template-columns: 0.7fr 1.5fr 1fr;
		align-items: start;
		gap: 0.6rem;
		margin-top: 0.7rem;
	}
	.interrupt-components > label {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		border-radius: 0.7rem;
		background: var(--background);
		padding: 0.7rem;
		font-size: 0.7rem;
	}

	@media (max-width: 52rem) {
		.interrupt-components {
			grid-template-columns: 1fr;
		}
	}
</style>
