<script lang="ts">
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';

	import { Button } from '#lib/bedrock/ui/button';

	import * as Dialog from '#lib/bedrock/ui/dialog';
	import * as AlertDialog from '#lib/bedrock/ui/alert-dialog';
</script>

<Benchmark
	id="dialog-surfaces"
	title="Dialog und Alert Dialog"
	summary="Backdrop, Inhalt, Escape, Fokus-Rückgabe und explizite Bestätigung mit realen Komponenten."
	hardCase="Dialog öffnen, vor Abschluss mit Escape schließen und sofort erneut öffnen. Fokus muss zum Trigger zurückkehren; kein altes Outro darf den neuen Inhalt entfernen."
	verdict="beobachten"
	finding="Dialogtext wird nach 140 ms lesbar, der Backdrop nutzt 410 ms. Der separate Präsenz-Takt erhält die Fläche; Austritt folgt 175 ms. Fokus bleibt unabhängig."
	metadata={{
		role: 'Overlay / große Fläche',
		duration: 'Inhalt 140 ms; Backdrop/Präsenz 410 ms; Austritt 175 ms',
		easing: 'Astryx enter / exit',
		distance: 'Keine Skalierung',
		origin: 'Mitte',
		properties: 'transform, opacity, backdrop-filter',
		layout: 'Nein',
		loop: 'Nein',
		reduced: 'Zentrale OS-/Anwendungspolicy erreicht auch portallierte Flächen.'
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

<style>
	.layer-row {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}
	.layer-row {
		margin-top: 0.75rem;
	}
</style>
