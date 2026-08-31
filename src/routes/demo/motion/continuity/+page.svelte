<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';
	import {
		LayoutGroup,
		layout,
		motionEasings,
		motionPresets,
		reveal
	} from '#lib/bedrock/motion/index.js';
	import { Button } from '#lib/bedrock/ui/button';
	import { Slider } from '#lib/bedrock/ui/slider';
	import * as Tabs from '#lib/bedrock/ui/tabs';
	import * as Accordion from '#lib/bedrock/ui/accordion';
	import * as Resizable from '#lib/bedrock/ui/resizable';

	const tabItems = [
		['signal', 'Signal'],
		['operations', 'Betrieb & Einsatzplanung'],
		['load', 'Last'],
		['accessibility', 'Barrierefreiheit'],
		['report', 'Abschlussbericht mit langem Titel']
	] as const;
	let activeTab = $state('signal');
	let dynamicLabel = $state(false);
	let monthOffset = $state(0);
	let direction = $state<1 | -1>(1);
	let pageIndex = $state(1);
	let accordionValue = $state('small');
	let customOpen = $state(false);
	let asyncContent = $state(false);
	let tableRows = new SvelteSet<number>();
	let asyncTimer = 0;
	let sliderValue = $state(38);
	let dragX = $state(0);
	let dragging = $state(false);
	let settling = $state(false);
	let dragOrigin = 0;
	let pointerOrigin = 0;
	let sortable = $state(['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo']);

	const indicator = layout({ transition: motionPresets.swap });
	const reorderItem = layout({ type: 'position', transition: motionPresets.layout });

	function chooseTab(value: string) {
		activeTab = value;
	}

	function navigate(delta: 1 | -1) {
		direction = delta;
		monthOffset += delta;
		pageIndex = Math.max(1, Math.min(9, pageIndex + delta));
	}

	function monthLabel(offset: number) {
		const date = new Date(2026, 7 + offset, 1);
		return new Intl.DateTimeFormat('de-AT', { month: 'long', year: 'numeric' }).format(date);
	}

	function openDynamic() {
		clearTimeout(asyncTimer);
		customOpen = !customOpen;
		asyncContent = false;
		if (customOpen) asyncTimer = window.setTimeout(() => (asyncContent = true), 220);
	}

	function toggleRows(all = false) {
		if (all) {
			if (tableRows.size === 20) tableRows.clear();
			else for (const index of Array.from(Array(20).keys())) tableRows.add(index);
			return;
		}
		const wasOpen = tableRows.has(0);
		tableRows.clear();
		if (!wasOpen) tableRows.add(0);
	}

	function startDrag(event: PointerEvent) {
		const element = event.currentTarget as HTMLElement;
		element.setPointerCapture(event.pointerId);
		dragging = true;
		settling = false;
		pointerOrigin = event.clientX;
		dragOrigin = dragX;
	}

	function moveDrag(event: PointerEvent) {
		if (!dragging) return;
		dragX = Math.max(0, Math.min(240, dragOrigin + event.clientX - pointerOrigin));
	}

	function endDrag(cancelled = false) {
		if (!dragging) return;
		dragging = false;
		settling = true;
		dragX = cancelled ? 0 : Math.round(dragX / 60) * 60;
	}

	function moveItem(index: number, delta: -1 | 1) {
		const target = index + delta;
		if (target < 0 || target >= sortable.length) return;
		const next = [...sortable];
		[next[index], next[target]] = [next[target]!, next[index]!];
		sortable = next;
	}

	onDestroy(() => clearTimeout(asyncTimer));
</script>

<div class="page-stack">
	<header class="page-heading">
		<p>03 · Kontinuität & Layout</p>
		<h2>Das Auge verfolgt Objekte, nicht Zustandsnamen</h2>
		<span
			>Navigation behält Richtung, Offenlegung hält den Layoutfluss verständlich und direkte
			Manipulation bleibt ohne Easing am Input.</span
		>
	</header>

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

	<Benchmark
		id="directional-navigation"
		title="Pagination, Kalender und carouselartige Richtung"
		summary="Vorwärts kommt von rechts, rückwärts von links. Monat und Seite wechseln gemeinsam, sodass sofortige Umkehr sichtbar wird."
		hardCase="Fünfmal schnell Weiter und sofort zweimal Zurück. Kein Inhalt darf in der alten Richtung nachlaufen oder nach dem Zielwechsel erscheinen."
		verdict="beobachten"
		metadata={{
			role: 'Bewegung / Kontinuität',
			duration: 'motionPresets.enter / exit · 230 / 175 ms',
			easing: 'enter / exit',
			distance: '24 px richtungsabhängig',
			origin: 'Navigationsachse',
			properties: 'transform, opacity',
			layout: 'Nein',
			loop: 'Nein',
			reduced: 'Richtungsübersetzung entfällt; 80-ms-Opacity erhält Zustandsgrenze.'
		}}
	>
		<div class="direction-stage">
			<div class="direction-toolbar">
				<Button
					size="sm"
					variant="outline"
					aria-label="Vorheriger Monat"
					onclick={() => navigate(-1)}>← Zurück</Button
				>
				<span>Seite {pageIndex} / 9</span>
				<Button size="sm" variant="outline" aria-label="Nächster Monat" onclick={() => navigate(1)}
					>Weiter →</Button
				>
			</div>
			<div class="viewport">
				{#key monthOffset}
					<section class="direction-card lab-animated lab-spatial" data-direction={direction}>
						<small>Kalendernavigation · de-AT</small>
						<strong>{monthLabel(monthOffset)}</strong>
						<p>Richtungsprobe {pageIndex}: persistent gedachte Oberfläche.</p>
					</section>
				{/key}
			</div>
		</div>
	</Benchmark>

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

	<Benchmark
		id="table-expansion"
		title="20 Tabellenzeilen gleichzeitig aufklappen"
		summary="Eine dichte, tabellenartige Liste provoziert den teuersten Disclosure-Fall und macht Scrollbewegung sichtbar."
		hardCase="Alle 20 öffnen, sofort schließen und währenddessen Zeile 1 wieder öffnen. Layoutarbeit darf keine veralteten Panels zurücklassen."
		verdict="problem"
		finding="20 echte Höhenanimationen erzwingen Layout pro Frame. Für dichte Tabellen sind instant Expansion, ein einzelnes Detailpanel oder Virtualisierung meist sinnvoller."
		metadata={{
			role: 'Layout-Bewegung',
			duration: 'motionPresets.reveal × 20',
			easing: 'motionEasings.enter / exit',
			distance: '20 × 44 px Detailhöhe',
			properties: 'height, opacity, padding',
			layout: 'Pro Frame',
			loop: 'Nein',
			reduced: 'Sofortige Layoutänderung; Fokus und Zeilenbezug bleiben erhalten.'
		}}
	>
		{#snippet actions()}<Button size="sm" onclick={() => toggleRows(true)}
				>{tableRows.size === 20 ? 'Alle schließen' : '20 öffnen'}</Button
			>{/snippet}
		<div class="data-table">
			{#each Array.from(Array(20).keys()) as index (index)}
				<div class="data-row">
					<button
						type="button"
						aria-expanded={tableRows.has(index)}
						onclick={() => {
							if (tableRows.has(index)) tableRows.delete(index);
							else tableRows.add(index);
						}}
						><span>Datensatz {String(index + 1).padStart(2, '0')}</span><strong
							>{tableRows.has(index) ? '−' : '+'}</strong
						></button
					>
					{#if tableRows.has(index)}<div class="row-detail lab-animated">
							Detailinhalt für Datensatz {index + 1}; Höhe und Reflow unter Last prüfen.
						</div>{/if}
				</div>
			{/each}
		</div>
	</Benchmark>

	<Benchmark
		id="direct-manipulation"
		title="Direkte Manipulation, Snap und erneutes Greifen"
		summary="Slider und Resizer bleiben bibliothekseigen. Der Drag-Probekörper folgt Pointerbewegung exakt und animiert erst beim Snap nach dem Loslassen."
		hardCase="Ziehen → loslassen → während des Snap-Settlings erneut greifen; halb ziehen und umkehren; Pointer abbrechen; danach Tastatursteuerung am Slider."
		verdict="bestanden"
		metadata={{
			role: 'Direkte Manipulation',
			duration: 'Drag 0 ms · Settle motionPresets.state 175 ms',
			easing: 'Drag linear/1:1 · Settle move',
			distance: '0–240 px / Slider 0–100',
			properties: 'transform (Drag), inline position intern',
			layout: 'Nein',
			loop: 'Nein',
			reduced: 'Drag bleibt 1:1; Snap wird instant, Fokus-/Wertfeedback bleibt.'
		}}
	>
		<div class="manipulation-grid">
			<div class="manipulation-cell">
				<span>Slider · {sliderValue}</span>
				<Slider type="single" bind:value={sliderValue} min={0} max={100} />
			</div>
			<div class="manipulation-cell resizer-cell">
				<span>Resizable Panel</span>
				<Resizable.PaneGroup direction="horizontal" class="h-28 rounded-lg border">
					<Resizable.Pane defaultSize={45} minSize={20}><div class="pane">A</div></Resizable.Pane>
					<Resizable.Handle withHandle />
					<Resizable.Pane defaultSize={55} minSize={20}><div class="pane">B</div></Resizable.Pane>
				</Resizable.PaneGroup>
			</div>
		</div>
		<div class="drag-track">
			<button
				type="button"
				class:dragging
				class:settling
				class="drag-handle lab-spatial"
				style:transform={`translateX(${dragX}px)`}
				onpointerdown={startDrag}
				onpointermove={moveDrag}
				onpointerup={() => endDrag(false)}
				onpointercancel={() => endDrag(true)}
				ontransitionend={() => (settling = false)}
				aria-label="Ziehbarer Snap-Regler">↔</button
			>
		</div>
	</Benchmark>

	<Benchmark
		id="sortable-layout"
		title="Sortierbare Liste mit überlappender Bewegung"
		summary="Tastaturtaugliche Reorder-Aktionen verschieben reale Listenknoten mit der bestehenden Layout-Engine."
		hardCase="Ein Element schnell zweimal verschieben, während alle anderen noch unterwegs sind. Kein Element darf vom alten Rechteck neu starten."
		verdict="bestanden"
		metadata={{
			role: 'Layout-Bewegung',
			duration: 'motionPresets.layout · 500 ms',
			easing: 'layout spring 117/18.4/1',
			distance: 'durch Reorder-Geometrie',
			properties: 'transform',
			layout: 'Einmalige Messung',
			loop: 'Nein',
			reduced: 'Reihenfolge ändert sich sofort; Buttons und Live-Reihenfolge bleiben zugänglich.'
		}}
	>
		<LayoutGroup class="sortable-list">
			{#each sortable as item, index (item)}
				<div {@attach reorderItem}>
					<span>{index + 1}. {item}</span>
					<div>
						<button
							type="button"
							aria-label={`${item} nach oben`}
							disabled={index === 0}
							onclick={() => moveItem(index, -1)}>↑</button
						><button
							type="button"
							aria-label={`${item} nach unten`}
							disabled={index === sortable.length - 1}
							onclick={() => moveItem(index, 1)}>↓</button
						>
					</div>
				</div>
			{/each}
		</LayoutGroup>
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
	.direction-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}
	.direction-toolbar span {
		color: var(--muted-foreground);
		font-size: 0.7rem;
	}
	.viewport {
		overflow: hidden;
		margin-top: 0.7rem;
		border-radius: 0.9rem;
	}
	.direction-card {
		min-height: 9rem;
		border-radius: 0.9rem;
		background: var(--background);
		padding: 1.2rem;
		animation: navigate-in var(--motion-enter) var(--ease-enter) both;
	}
	.direction-card[data-direction='-1'] {
		--travel: -24px;
	}
	.direction-card small,
	.direction-card strong {
		display: block;
	}
	.direction-card small {
		color: var(--muted-foreground);
		font-size: 0.65rem;
	}
	.direction-card strong {
		margin-top: 1.2rem;
		font-size: 1.3rem;
	}
	.direction-card p {
		margin-top: 0.25rem;
		color: var(--muted-foreground);
		font-size: 0.75rem;
	}
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
	.data-table {
		max-height: 25rem;
		overflow: auto;
		border: 1px solid var(--border);
		border-radius: 0.8rem;
		background: var(--background);
	}
	.data-row + .data-row {
		border-top: 1px solid var(--border);
	}
	.data-row button {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: space-between;
		padding: 0.55rem 0.7rem;
		font-size: 0.7rem;
	}
	.row-detail {
		background: var(--muted);
		padding: 0.65rem 0.7rem;
		color: var(--muted-foreground);
		font-size: 0.68rem;
		animation: detail-in var(--motion-reveal) var(--ease-enter) both;
	}
	.manipulation-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem;
	}
	.manipulation-cell {
		min-width: 0;
		border-radius: 0.8rem;
		background: var(--background);
		padding: 0.8rem;
	}
	.manipulation-cell > span {
		display: block;
		margin-bottom: 0.7rem;
		color: var(--muted-foreground);
		font-size: 0.68rem;
	}
	.pane {
		display: grid;
		height: 100%;
		place-items: center;
		color: var(--muted-foreground);
		font-size: 0.7rem;
	}
	.drag-track {
		position: relative;
		height: 3rem;
		max-width: 280px;
		margin-top: 0.8rem;
		border-radius: 999px;
		background: var(--background);
		padding: 0.3rem;
		touch-action: none;
	}
	.drag-track::after {
		position: absolute;
		top: 50%;
		right: 0.7rem;
		left: 0.7rem;
		height: 1px;
		background: var(--border);
		content: '';
	}
	.drag-handle {
		position: relative;
		z-index: 1;
		display: grid;
		width: 2.4rem;
		height: 2.4rem;
		place-items: center;
		border-radius: 50%;
		background: var(--foreground);
		color: var(--background);
		cursor: grab;
		user-select: none;
	}
	.drag-handle.dragging {
		cursor: grabbing;
	}
	.drag-handle.settling {
		transition: transform var(--motion-state) var(--ease-move);
	}
	:global(.sortable-list) {
		display: grid;
		gap: 0.35rem;
	}
	:global(.sortable-list > div) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 0.7rem;
		background: var(--background);
		padding: 0.55rem 0.7rem;
		font-size: 0.72rem;
	}
	:global(.sortable-list button) {
		width: 1.8rem;
		height: 1.8rem;
		border-radius: 0.45rem;
		background: var(--muted);
	}
	:global(.sortable-list button:disabled) {
		opacity: 0.25;
	}

	@keyframes navigate-in {
		from {
			transform: translateX(var(--travel, 24px));
			opacity: 0;
		}
	}
	@keyframes detail-in {
		from {
			opacity: 0;
			clip-path: inset(50% 0);
		}
	}
	@media (max-width: 42rem) {
		.manipulation-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
