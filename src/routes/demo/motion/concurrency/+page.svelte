<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import XIcon from '@lucide/svelte/icons/x';
	import CheckIcon from '@lucide/svelte/icons/check';
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';
	import {
		LayoutGroup,
		appear,
		layout,
		motionEasings,
		motionPresets,
		reveal,
		vanish
	} from '#lib/bedrock/motion/index.js';
	import { Button } from '#lib/bedrock/ui/button';
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	import { Switch } from '#lib/bedrock/ui/switch';
	import * as Accordion from '#lib/bedrock/ui/accordion';
	import * as Dialog from '#lib/bedrock/ui/dialog';

	type Toast = { id: number; title: string };
	type ListItem = { id: number; label: string };

	let toastId = $state(3);
	let toasts = $state<Toast[]>([
		{ id: 3, title: 'Motion-Bericht bereit' },
		{ id: 2, title: 'Layout-Messung beendet' },
		{ id: 1, title: 'Reduced Mode geprüft' }
	]);
	let requestState = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
	let requestTimer = 0;
	let email = $state('motion@');
	let touched = $state(false);
	let listId = $state(6);
	let items = $state<ListItem[]>(
		Array.from({ length: 6 }, (_, index) => ({ id: index + 1, label: `Signal ${index + 1}` }))
	);
	let filtered = $state(false);
	let restoreSnapshot = $state<ListItem[]>([]);
	let interruptTarget = $state<'a' | 'b' | 'c'>('a');
	let interruptRunning = $state(false);
	let interruptTimers: number[] = [];
	let interruptSwitch = $state(false);
	let interruptAccordion = $state('');
	let instantMotion = $state(false);
	let denseSelection = new SvelteSet<number>();
	let search = $state('mo');
	let numericValue = $state(1482);

	const toastLayout = layout({ type: 'position', transition: motionPresets.layout });
	const listLayout = layout({ type: 'position', transition: motionPresets.layout });
	const searchResults = $derived(
		['Motion Lab', 'Motion Tokens', 'Motion Policy', 'Layout Motion', 'Reduced Motion'].filter(
			(item) => item.toLowerCase().includes(search.toLowerCase())
		)
	);
	const emailError = $derived(
		touched && !/^[^@]+@[^@]+\.[^@]+$/.test(email)
			? email.includes('@')
				? 'Die Domain ist unvollständig.'
				: 'Eine gültige E-Mail-Adresse eingeben.'
			: ''
	);

	function addToast() {
		toastId += 1;
		toasts = [{ id: toastId, title: `Neue Meldung ${toastId}` }, ...toasts].slice(0, 5);
	}

	function dismissToast(id: number) {
		toasts = toasts.filter((toast) => toast.id !== id);
	}

	function dismissSeveral() {
		toasts = toasts.filter((_, index) => index % 2 === 1);
		window.setTimeout(addToast, 70);
	}

	function startRequest(result: 'success' | 'error') {
		clearTimeout(requestTimer);
		requestState = 'loading';
		requestTimer = window.setTimeout(() => (requestState = result), 650);
	}

	function insertItem() {
		listId += 1;
		items = [{ id: listId, label: `Signal ${listId}` }, ...items];
	}

	function deleteItem(id: number) {
		items = items.filter((item) => item.id !== id);
	}

	function reorderItems() {
		items = [...items].reverse();
	}

	function filterItems() {
		filtered = !filtered;
	}

	function clearItems() {
		restoreSnapshot = items;
		items = [];
	}

	function restoreItems() {
		items = restoreSnapshot.length
			? restoreSnapshot
			: Array.from({ length: 6 }, (_, index) => ({ id: index + 1, label: `Signal ${index + 1}` }));
	}

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

	function toggleDense(index: number) {
		if (denseSelection.has(index)) denseSelection.delete(index);
		else denseSelection.add(index);
	}

	onDestroy(() => {
		clearTimeout(requestTimer);
		for (const timer of interruptTimers) clearTimeout(timer);
	});
</script>

<div class="page-stack">
	<header class="page-heading">
		<p>04 · Gleichzeitigkeit</p>
		<h2>Die echte Prüfung beginnt, wenn nichts allein animiert</h2>
		<span
			>Eintritt, Austritt, Reflow, Validierung und neue Ziele überlappen absichtlich. Endzustand und
			Orientierung zählen mehr als die Choreografie.</span
		>
	</header>

	<Benchmark
		id="toast-stack"
		title="Toast-Stack mit konkurrierendem Eintritt und Austritt"
		summary="Bis zu fünf Meldungen treten ein, verlassen den Stack und verschieben die verbleibenden Karten über Bedrocks Presence- und Layout-Primitives."
		hardCase="Mehrere Toasts manuell schließen, während ein neuer eintritt. Ein zeitgedachtes Dismiss überlappt mit dem manuellen Dismiss und der gesamte Stack packt neu."
		verdict="bestanden"
		metadata={{
			role: 'Layout-Bewegung',
			duration: 'enter 230 · exit 175 · layout 500 ms',
			easing: 'enter / exit / layout spring',
			distance: 'durch Stack-Reflow',
			properties: 'transform, opacity, clip-path',
			layout: 'Einmalige Messung',
			loop: 'Nein',
			reduced: 'Ein-/Austritt und Packing werden instant; aria-live und Reihenfolge bleiben.'
		}}
	>
		{#snippet actions()}<Button size="sm" variant="outline" onclick={dismissSeveral}
				>Mehrere + neu</Button
			>{/snippet}
		<div class="toast-controls">
			<Button size="sm" onclick={addToast}>Toast hinzufügen</Button><span
				>{toasts.length} / 5 aktiv</span
			>
		</div>
		<LayoutGroup class="toast-stack" role="log" aria-live="polite" aria-relevant="additions">
			{#each toasts as toast (toast.id)}
				<article
					{@attach toastLayout}
					in:appear={{ duration: motionPresets.enter.duration }}
					out:vanish={{ duration: motionPresets.exit.duration }}
				>
					<div><small>Systemmeldung</small><strong>{toast.title}</strong></div>
					<button
						type="button"
						aria-label={`${toast.title} schließen`}
						onclick={() => dismissToast(toast.id)}><XIcon /></button
					>
				</article>
			{/each}
		</LayoutGroup>
	</Benchmark>

	<Benchmark
		id="async-and-validation"
		title="Async Button und Live-Validierung"
		summary="Anfragezustand und Fehlermeldung können sich ändern, während der Nutzer bereits weiter tippt oder eine neue Anfrage startet."
		hardCase="Loading mit Erfolg starten, sofort Fehler anfordern und währenddessen die Fehlermeldung durch schnelles Tippen zweimal ändern. Buttonbreite und Formularlayout bleiben stabil."
		verdict="beobachten"
		metadata={{
			role: 'Zustandswechsel',
			duration: 'state 175 · reveal 310 / exit 175 ms',
			easing: 'state default · enter / exit',
			properties: 'opacity, height, padding; Spinner transform',
			layout: 'Pro Frame',
			loop: 'Ja',
			reduced: 'Statusicon und Text bleiben; Spinner stoppt; Meldung wechselt mit kurzer Opacity.'
		}}
	>
		<div class="async-grid">
			<div class="request-card">
				<Button class="w-44" onclick={() => startRequest('success')}>
					{#if requestState === 'loading'}<LoaderCircleIcon class="lab-loop animate-spin" /> Lädt …
					{:else if requestState === 'success'}<CheckIcon /> Gespeichert
					{:else if requestState === 'error'}Fehlgeschlagen
					{:else}Erfolg anfordern{/if}
				</Button>
				<Button variant="outline" onclick={() => startRequest('error')}>Fehler anfordern</Button>
			</div>
			<label class="field"
				><span>E-Mail für Bericht</span><input
					bind:value={email}
					onblur={() => (touched = true)}
					oninput={() => (touched = true)}
					aria-invalid={emailError ? 'true' : undefined}
				/>
				{#if emailError}<div
						class="validation-message"
						in:reveal={{ duration: motionPresets.reveal.duration, easing: motionEasings.enter }}
						out:reveal={{ duration: motionPresets.exit.duration, easing: motionEasings.exit }}
					>
						{emailError}
					</div>{:else if touched}<div class="success-message">Format gültig.</div>{/if}
			</label>
		</div>
	</Benchmark>

	<Benchmark
		id="dynamic-list"
		title="Dynamische Liste: insert, delete, reorder, filter, clear, restore"
		summary="Presence erklärt Hinzufügen und Entfernen; Layout hält bestehende Identitäten über Umordnung und Filterung verfolgbar."
		hardCase="Löschen, sofort einfügen und umordnen; während alles läuft filtern. Danach leeren und wiederherstellen, ohne veraltete Animationen."
		verdict="bestanden"
		metadata={{
			role: 'Layout-Bewegung',
			duration: 'enter 230 · exit 175 · layout 500 ms',
			easing: 'enter / exit / layout spring',
			distance: 'durch neue Listengeometrie',
			properties: 'transform, opacity, clip-path',
			layout: 'Einmalige Messung',
			loop: 'Nein',
			reduced: 'Liste aktualisiert instant; Identität bleibt über Labels und Reihenfolge erkennbar.'
		}}
	>
		<div class="list-actions">
			<Button size="sm" onclick={insertItem}>Einfügen</Button><Button
				size="sm"
				variant="outline"
				onclick={reorderItems}>Umordnen</Button
			><Button size="sm" variant="outline" onclick={filterItems}>Filtern</Button><Button
				size="sm"
				variant="outline"
				onclick={clearItems}>Leeren</Button
			><Button size="sm" variant="ghost" onclick={restoreItems}>Wiederherstellen</Button>
		</div>
		<LayoutGroup class="dynamic-list">
			{#each filtered ? items.filter((item) => item.id % 2 === 0) : items as item (item.id)}
				<div {@attach listLayout} in:appear out:vanish>
					<span>{item.label}</span><button
						type="button"
						aria-label={`${item.label} löschen`}
						onclick={() => deleteItem(item.id)}><XIcon /></button
					>
				</div>
			{:else}<p>Keine Ergebnisse. Hier wird nichts animiert, nur weil Daten fehlen.</p>{/each}
		</LayoutGroup>
	</Benchmark>

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

	<Benchmark
		id="should-this-animate"
		title="Soll das überhaupt animieren?"
		summary="Dichte, hochfrequente Zustände werden standardmäßig instant gezeigt. Ein Schalter aktiviert absichtlich unnötige Motion zum direkten Vergleich."
		hardCase="Tastaturmenü halten, Suchbegriff bei jedem Keystroke ändern, 12 Tabellenzeilen auswählen und Zahlen zehnmal pro Sekunde aktualisieren."
		verdict="kein-motion"
		finding="Keine Animation ist hier die richtige Motion-Entscheidung. Fokus, Farbe und Struktur liefern bereits ausreichendes Feedback ohne visuelle Latenz."
		metadata={{
			role: 'Press / unmittelbares Feedback',
			duration: '0 ms empfohlen',
			easing: 'nicht relevant',
			distance: '0',
			properties: 'Farbe/Fokus instant',
			layout: 'Nein',
			loop: 'Nein',
			reduced: 'Identisch zum Normalmodus.'
		}}
	>
		{#snippet actions()}<label class="motion-toggle"
				><Checkbox bind:checked={instantMotion} /> unnötige Motion zeigen</label
			>{/snippet}
		<div class:unnecessary-motion={instantMotion} class="frequency-grid">
			<div class="search-probe">
				<label>Autocomplete<input bind:value={search} /></label>
				<div>
					{#each searchResults as result (result)}<button type="button">{result}</button>{/each}
				</div>
			</div>
			<div class="dense-table">
				{#each Array.from(Array(12).keys()) as index (index)}<button
						type="button"
						aria-pressed={denseSelection.has(index)}
						onclick={() => toggleDense(index)}
						>Zeile {index + 1}<span>{denseSelection.has(index) ? 'ausgewählt' : '—'}</span></button
					>{/each}
			</div>
			<div class="number-probe">
				<span>Live-Wert</span><strong>{new Intl.NumberFormat('de-AT').format(numericValue)}</strong
				><Button
					size="sm"
					variant="outline"
					onclick={() => {
						for (let i = 1; i <= 10; i += 1) window.setTimeout(() => (numericValue += 7), i * 60);
					}}>10 Updates</Button
				>
			</div>
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
		max-width: 25ch;
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
	.toast-controls,
	.list-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
	}
	.toast-controls span {
		color: var(--muted-foreground);
		font-size: 0.68rem;
	}
	:global(.toast-stack) {
		position: relative;
		display: grid;
		gap: 0.4rem;
		margin-top: 0.6rem;
	}
	:global(.toast-stack article) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 1px solid var(--border);
		border-radius: 0.8rem;
		background: var(--background);
		padding: 0.65rem 0.75rem;
	}
	:global(.toast-stack small),
	:global(.toast-stack strong) {
		display: block;
	}
	:global(.toast-stack small) {
		color: var(--muted-foreground);
		font-size: 0.58rem;
	}
	:global(.toast-stack strong) {
		margin-top: 0.12rem;
		font-size: 0.75rem;
	}
	:global(.toast-stack button),
	:global(.dynamic-list button) {
		width: 1.8rem;
		height: 1.8rem;
		border-radius: 0.45rem;
		color: var(--muted-foreground);
	}
	.async-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem;
	}
	.request-card,
	.field {
		display: flex;
		min-height: 8rem;
		flex-wrap: wrap;
		align-content: center;
		gap: 0.5rem;
		border-radius: 0.8rem;
		background: var(--background);
		padding: 0.8rem;
	}
	.field {
		display: grid;
	}
	.field > span {
		color: var(--muted-foreground);
		font-size: 0.68rem;
	}
	.field input,
	.search-probe input {
		height: 2.2rem;
		border: 1px solid var(--border);
		border-radius: 0.6rem;
		background: var(--card);
		padding: 0 0.65rem;
		font-size: 0.75rem;
		outline: none;
	}
	.field input:focus,
	.search-probe input:focus {
		border-color: var(--ring);
		box-shadow: 0 0 0 2px color-mix(in oklab, var(--ring), transparent 75%);
	}
	.validation-message,
	.success-message {
		color: #b42318;
		font-size: 0.7rem;
	}
	.success-message {
		color: #08752c;
	}
	:global(.dynamic-list) {
		position: relative;
		display: grid;
		gap: 0.35rem;
		margin-top: 0.7rem;
	}
	:global(.dynamic-list > div) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 0.7rem;
		background: var(--background);
		padding: 0.55rem 0.7rem;
		font-size: 0.72rem;
	}
	:global(.dynamic-list > p) {
		color: var(--muted-foreground);
		font-size: 0.72rem;
	}
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
	.motion-toggle {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.7rem;
	}
	.frequency-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 0.7fr;
		gap: 0.6rem;
	}
	.frequency-grid > div {
		border-radius: 0.8rem;
		background: var(--background);
		padding: 0.7rem;
	}
	.search-probe label,
	.search-probe label input {
		display: block;
		width: 100%;
	}
	.search-probe label {
		color: var(--muted-foreground);
		font-size: 0.65rem;
	}
	.search-probe input {
		margin-top: 0.3rem;
	}
	.search-probe > div {
		display: grid;
		margin-top: 0.4rem;
	}
	.search-probe button,
	.dense-table button {
		display: flex;
		width: 100%;
		justify-content: space-between;
		border-radius: 0.4rem;
		padding: 0.35rem;
		text-align: left;
		font-size: 0.68rem;
	}
	.search-probe button:focus,
	.dense-table button:focus,
	.dense-table button[aria-pressed='true'] {
		background: var(--foreground);
		color: var(--background);
	}
	.dense-table span {
		color: var(--muted-foreground);
	}
	.dense-table button[aria-pressed='true'] span {
		color: inherit;
	}
	.number-probe {
		display: grid;
		align-content: center;
		gap: 0.5rem;
	}
	.number-probe span {
		color: var(--muted-foreground);
		font-size: 0.65rem;
	}
	.number-probe strong {
		font-variant-numeric: tabular-nums;
		font-size: 1.4rem;
	}
	.unnecessary-motion :is(button, strong, .search-probe > div) {
		transition: all 400ms ease;
	}
	.unnecessary-motion .dense-table button[aria-pressed='true'] {
		transform: translateX(6px);
	}

	@media (max-width: 52rem) {
		.interrupt-components,
		.frequency-grid {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 42rem) {
		.async-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
