<script lang="ts">
	import { onDestroy } from 'svelte';

	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';
	import { motionEasings, motionPresets, reveal } from '#lib/bedrock/motion/index.js';
	import { Button } from '#lib/bedrock/ui/button';

	import * as Accordion from '#lib/bedrock/ui/accordion';

	let accordionValue = $state('small');
	let customOpen = $state(false);
	let asyncContent = $state(false);
	let asyncTimer = 0;
	function openDynamic() {
		clearTimeout(asyncTimer);
		customOpen = !customOpen;
		asyncContent = false;
		if (customOpen) asyncTimer = window.setTimeout(() => (asyncContent = true), 220);
	}
	onDestroy(() => clearTimeout(asyncTimer));
</script>

<Benchmark
	id="disclosure-heights"
	title="Accordion und dynamische Offenlegung"
	summary="Kleine, mittlere und sehr hohe Inhalte nutzen die reale Accordion-Animation; die Zusatzprobe erhält asynchronen Inhalt während des Öffnens."
	hardCase="Öffnen → vor Ende schließen; erneut öffnen und 220 ms später zusätzlichen Inhalt einfügen. Umliegender Content darf nicht springen oder abgeschnitten bleiben."
	verdict="problem"
	finding="Das ausgelieferte Accordion animiert height pro Frame mit einer generischen 200-ms-Kurve. Bedrocks reveal/autoSize existieren, sind aber nicht in das Component integriert."
	metadata={{
		role: 'Offenlegung',
		duration: 'Accordion 200 ms · Bedrock reveal 310 ms',
		easing: 'Accordion ease-out · Bedrock enter/exit',
		distance: 'intrinsische Höhe',
		properties: 'height, opacity, padding, margin, border',
		layout: 'Pro Frame',
		loop: 'Nein',
		reduced: 'Bedrock-Demo wird instant; ausgelieferte Accordion-CSS ist nicht zentral abgedeckt.'
	}}
>
	<Accordion.Root type="single" bind:value={accordionValue}>
		<Accordion.Item value="small"
			><Accordion.Trigger>Kleiner Inhalt</Accordion.Trigger><Accordion.Content
				>Eine kurze Zeile.</Accordion.Content
			></Accordion.Item
		>
		<Accordion.Item value="medium"
			><Accordion.Trigger>Mittlerer Inhalt</Accordion.Trigger><Accordion.Content
				><p>Vier Zeilen machen die Geschwindigkeitswirkung sichtbar.</p>
				<p>Der umliegende Inhalt folgt dem Reflow.</p>
				<p>Während der Öffnung erneut schließen.</p>
				<p>Danach per Tastatur wieder öffnen.</p></Accordion.Content
			></Accordion.Item
		>
		<Accordion.Item value="tall"
			><Accordion.Trigger>Sehr hoher Inhalt</Accordion.Trigger><Accordion.Content
				>{#each Array.from(Array(14).keys()) as index (index)}<p>
						Diagnosezeile {index + 1}: Clipping und Scrollsprung beobachten.
					</p>{/each}</Accordion.Content
			></Accordion.Item
		>
	</Accordion.Root>
	<div class="dynamic-disclosure">
		<Button size="sm" variant="outline" aria-expanded={customOpen} onclick={openDynamic}
			>{customOpen ? 'Dynamischen Inhalt schließen' : 'Dynamischen Inhalt öffnen'}</Button
		>
		{#if customOpen}
			<div
				in:reveal={{ duration: motionPresets.reveal.duration, easing: motionEasings.enter }}
				out:reveal={{ duration: motionPresets.exit.duration, easing: motionEasings.exit }}
			>
				<div class="dynamic-copy">
					<p>Der erste Absatz ist sofort vorhanden.</p>
					{#if asyncContent}<p class="async-copy">
							Asynchroner Inhalt ist während der Offenlegung eingetroffen. Die Zielhöhe hat sich
							geändert.
						</p>{/if}
				</div>
			</div>
		{/if}
	</div>
</Benchmark>

<style>
	.dynamic-disclosure {
		margin-top: 1rem;
		border-top: 1px solid var(--border);
		padding-top: 1rem;
	}
	.dynamic-copy {
		margin-top: 0.5rem;
		border-radius: 0.75rem;
		background: var(--background);
		padding: 0.8rem;
		color: var(--muted-foreground);
		font-size: 0.75rem;
	}
	.async-copy {
		margin-top: 0.5rem;
		color: var(--foreground);
	}
</style>
