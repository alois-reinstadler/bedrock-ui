<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';
	import { useMotionLabState } from '#lib/site/motion-lab/context.svelte.js';
	import { Button } from '#lib/bedrock/ui/button';
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	import { Progress } from '#lib/bedrock/ui/progress';
	import { Skeleton } from '#lib/bedrock/ui/skeleton';
	import { Spinner } from '#lib/bedrock/ui/spinner';
	import { Slider } from '#lib/bedrock/ui/slider';

	const lab = useMotionLabState();
	let loaded = $state(false);
	let progress = $state(36);
	let longRunning = $state(true);
	let selectedRows = new SvelteSet<number>();
	let expandedRows = new SvelteSet<number>();
	let scaleSwitches = $state(Array.from({ length: 50 }, (_, index) => index % 4 === 0));
	let tableRows = $state(
		Array.from({ length: 80 }, (_, index) => ({ id: index + 1, value: (index + 1) * 17 }))
	);
	let navIndex = $state(0);
	let compatibilityRun = $state(false);
	let performanceResult = $state<{
		frames: number;
		longFrames: number;
		maxGap: number;
		average: number;
	} | null>(null);
	let probeFrame = 0;
	let numericTimer = 0;

	const representative = [
		['Button', 'Farbe und Press-Feedback bleiben; Translation entfällt.'],
		['Popover', 'Scale/Slide entfällt; kurze Opacity erhält Kontextwechsel.'],
		['Dialog', 'Keine Scale- oder große Raumbewegung; Fokus und Backdrop bleiben.'],
		['Drawer', 'Fläche erscheint instant an der Kante; kein langer Weg.'],
		['Accordion', 'Inhalt wird direkt im Layout gesetzt; Chevron/Zustand bleibt.'],
		['Tabs', 'Indikator springt ans Ziel; Fokus- und Auswahlfarbe bleiben.'],
		['Slider', 'Pointer bleibt 1:1; Snap wird instant.'],
		['Toast', 'Kurze Opacity statt Stack-Reise; Live-Region bleibt.'],
		['Spinner', 'Rotation stoppt; statisches Statusglyph bleibt.'],
		['Skeleton', 'Puls stoppt; statische Platzhalter bleiben.'],
		['Navigation', 'Richtungstranslation entfällt; Inhalt wechselt mit Opacity.']
	] as const;

	let instanceCount = $derived(
		lab.stressMode === 'many' ? 48 : lab.stressMode === 'rapid' ? 20 : 8
	);

	function toggleScaleControls() {
		scaleSwitches = scaleSwitches.map((value) => !value);
	}

	function toggleRow(index: number) {
		if (selectedRows.has(index)) selectedRows.delete(index);
		else selectedRows.add(index);
	}

	function toggleExpansion(index: number) {
		if (expandedRows.has(index)) expandedRows.delete(index);
		else expandedRows.add(index);
	}

	function mutateTable() {
		tableRows = [{ id: Date.now(), value: 999 }, ...tableRows.slice().reverse().slice(0, 79)];
		navIndex = (navIndex + 7) % 9;
	}

	function runPerformanceProbe() {
		cancelAnimationFrame(probeFrame);
		performanceResult = null;
		const samples: number[] = [];
		let previous = performance.now();
		const started = previous;
		toggleScaleControls();
		mutateTable();
		const sample = (now: number) => {
			samples.push(now - previous);
			previous = now;
			if (now - started < 1000) {
				probeFrame = requestAnimationFrame(sample);
				return;
			}
			const total = samples.reduce((sum, value) => sum + value, 0);
			performanceResult = {
				frames: samples.length,
				longFrames: samples.filter((value) => value > 25).length,
				maxGap: Math.round(Math.max(...samples) * 10) / 10,
				average: Math.round((total / samples.length) * 10) / 10
			};
		};
		probeFrame = requestAnimationFrame(sample);
	}

	function runRapidNavigation() {
		clearInterval(numericTimer);
		let count = 0;
		numericTimer = window.setInterval(() => {
			navIndex = (navIndex + (count < 7 ? 1 : -1) + 9) % 9;
			progress = (progress + 13) % 101;
			count += 1;
			if (count >= 12) clearInterval(numericTimer);
		}, 55);
	}

	onDestroy(() => {
		if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(probeFrame);
		clearInterval(numericTimer);
	});
</script>

<div class="page-stack">
	<header class="page-heading">
		<p>05 · Zugänglichkeit & Last</p>
		<h2>Reduced Motion ist eine andere Sprache, nicht Stille</h2>
		<span
			>Räumliche Bewegung und Schleifen dürfen verschwinden, während Farbe, Fokus, Status und kurze
			Opacity weiterhin absichtsvoll kommunizieren.</span
		>
	</header>

	<Benchmark
		id="reduced-motion-matrix"
		title="Normal / Reduced: repräsentative Komponenten"
		summary="Elf Komponentenrollen werden als explizite Alternativstrategie gegenübergestellt. Der globale Toggle wendet den Lab-Override auf interaktive Szenarien an."
		hardCase="Während einer großen Translation auf Reduced wechseln. Aktive Bewegung muss abbrechen, der finale Zustand korrekt committen und Fokus sichtbar bleiben."
		verdict="problem"
		finding="Bedrocks eigene Helfer reagieren live, aber reduzieren aktuell binär auf 0 ms. Die Komponentenbibliothek und portalisierte Third-Party-Flächen haben keine gemeinsame Alternate-Mode-Policy."
		metadata={{
			role: 'Reduzierte Bewegung',
			duration: 'Normal: semantisch · Reduced: 0–80 ms je Rolle',
			easing: 'Normal: semantisch · Reduced: linear/opacity',
			distance: 'Reduced 0 px',
			properties: 'Reduced: opacity, color, outline',
			layout: 'Nein',
			loop: 'Nein',
			reduced: 'Dies ist die zu evaluierende Strategie selbst.'
		}}
	>
		<div class="mode-head"><strong>Normal Motion</strong><strong>Reduced Motion</strong></div>
		<div class="reduced-matrix">
			{#each representative as [name, rule], index (name)}
				<div class="mode-row">
					<div class="specimen normal-specimen">
						<i style:--specimen={index}></i><span>{name}</span>
					</div>
					<div class="specimen reduced-specimen">
						<i></i><span><strong>{name}</strong><small>{rule}</small></span>
					</div>
				</div>
			{/each}
		</div>
	</Benchmark>

	<Benchmark
		id="continuous-motion"
		title="Kontinuierliche Motion und Langzeitkadenz"
		summary="Echte Spinner, determinate Progress und Skeletons laufen einzeln und als Gruppe. Loading → Loaded beendet alle Schleifen."
		hardCase="48 Instanzen lange laufen lassen, Tab im Hintergrund lassen, dann Reduced aktivieren und Loading → Loaded wechseln. Keine Schleife darf unsichtbar weiterarbeiten."
		verdict="problem"
		finding="Spinner, Skeleton, OTP-Caret und Sonner-Loader haben keinen gemeinsamen Cadence-Token und ignorieren die Bedrock-Reduced-Policy."
		metadata={{
			role: 'Kontinuierliche Bewegung',
			duration: 'Utility-Defaults; keine Bedrock-Cadence-Tokens',
			easing: 'linear spin / pulse default',
			properties: 'transform, opacity',
			layout: 'Nein',
			loop: 'Ja',
			reduced: 'Lab stoppt Schleifen; Bibliothek selbst derzeit nicht.'
		}}
	>
		{#snippet actions()}<Button size="sm" onclick={() => (loaded = !loaded)}
				>{loaded ? 'Loading zeigen' : 'Als geladen markieren'}</Button
			>{/snippet}
		<div class="continuous-summary">
			<label><Checkbox bind:checked={longRunning} /> Langzeitbewegung aktiv</label><span
				>{instanceCount} Instanzen · Stress: {lab.stressMode}</span
			>
		</div>
		{#if loaded}
			<div class="loaded-state">
				<strong>Inhalt geladen</strong><span>Keine versteckte Schleife sollte weiterlaufen.</span>
			</div>
		{:else}
			<div class="continuous-grid" class:stopped={!longRunning}>
				{#each Array.from(Array(instanceCount).keys()) as index (index)}
					<div>
						<Spinner class="lab-loop" aria-label="Wird geladen" /><Skeleton
							class="lab-loop h-2 w-full"
						/><span>{index + 1}</span>
					</div>
				{/each}
			</div>
		{/if}
		<div class="progress-row">
			<Progress value={progress} max={100} /><span>{progress}%</span><Slider
				type="single"
				min={0}
				max={100}
				bind:value={progress}
			/>
		</div>
	</Benchmark>

	<Benchmark
		id="performance-scale"
		title="Performance / Scale: reale Komponenten unter Last"
		summary="50 Checkboxes, 80 Tabellenzeilen, bis zu 48 Skeletons und schnelle Navigation werden gemeinsam mutiert. Ein rAF-Probe misst Lücken für diese lokale Sitzung."
		hardCase="Alle Controls aktualisieren, Tabelle einfügen/umkehren, Zeilen erweitern und Navigation wiederholt vor/zurück setzen. Danach Konsole und Performance-Profil prüfen."
		verdict="beobachten"
		metadata={{
			role: 'Layout-Bewegung',
			duration: 'gemischt; bestehende Component-Utilities',
			easing: 'gemischt',
			properties: 'transform, opacity, height, background, shadow',
			layout: 'Pro Frame',
			loop: 'Ja',
			reduced: 'Schleifen stoppen; Layout und Auswahl committen instant.'
		}}
	>
		{#snippet actions()}<Button size="sm" onclick={runPerformanceProbe}>1-s-Probe starten</Button
			>{/snippet}
		{#if performanceResult}
			<div class="perf-readout" aria-live="polite">
				<span>Frames <strong>{performanceResult.frames}</strong></span><span
					>&gt;25 ms <strong>{performanceResult.longFrames}</strong></span
				><span>Max gap <strong>{performanceResult.maxGap} ms</strong></span><span
					>Ø <strong>{performanceResult.average} ms</strong></span
				>
			</div>
		{:else}<p class="perf-note">
				Die Laufzeitprobe ist orientierend, kein belastbares FPS-Budget. CDP-Profiling bleibt die
				maßgebliche Prüfung.
			</p>{/if}
		<div class="scale-actions">
			<Button size="sm" variant="outline" onclick={toggleScaleControls}>50 Controls</Button><Button
				size="sm"
				variant="outline"
				onclick={mutateTable}>Tabelle mutieren</Button
			><Button size="sm" variant="outline" onclick={runRapidNavigation}>Navigation stressen</Button
			><span>Nav {navIndex + 1} / 9</span>
		</div>
		<div class="scale-controls">
			{#each scaleSwitches as checked, index (index)}<label data-checked={checked}
					><Checkbox bind:checked={scaleSwitches[index]} /><span>{index + 1}</span></label
				>{/each}
		</div>
		<div class="stress-table">
			<div class="table-head"><span>Datensatz</span><span>Wert</span><span>Aktion</span></div>
			{#each tableRows.slice(0, lab.stressMode === 'many' ? 80 : 24) as row, index (row.id)}
				<div class="table-row" data-selected={selectedRows.has(row.id)}>
					<button type="button" onclick={() => toggleRow(row.id)}
						>#{String(row.id).slice(-4)}</button
					><span>{new Intl.NumberFormat('de-AT').format(row.value)}</span><button
						type="button"
						aria-expanded={expandedRows.has(row.id)}
						onclick={() => toggleExpansion(row.id)}
						>{expandedRows.has(row.id) ? 'Schließen' : 'Details'}</button
					>
				</div>
				{#if expandedRows.has(row.id)}<div class="table-detail">
						Erweiterte Daten für Zeile {index + 1}; Layout- und Scrollstabilität beobachten.
					</div>{/if}
			{/each}
		</div>
	</Benchmark>

	<Benchmark
		id="external-compatibility"
		title="Externe Animation und Transform-Eigentum"
		summary="Ein Consumer-Transform auf einem Wrapper bleibt sicher. Derselbe Transform direkt auf Button/Card kollidiert mit Library-Press, Layout oder Entry-Utilities."
		hardCase="Externe Transform-Animation laufen lassen und Button währenddessen drücken beziehungsweise Slider ziehen. Prüfen, welche Transform-Quelle gewinnt."
		verdict="problem"
		finding="Astra projection owns its element transform. Keep authored transforms, CSS gestures and projection on separate wrapper elements to avoid competing writers."
		metadata={{
			role: 'Bewegung / Kontinuität',
			duration: 'Consumer 900 ms · Library press/default',
			easing: 'Consumer move · Library defaults',
			distance: '18 px + 2°',
			properties: 'transform (Kollision)',
			layout: 'Nein',
			loop: 'Ja',
			reduced: 'Consumer muss Preference selbst respektieren; Wrapper bleibt strukturell sicher.'
		}}
	>
		{#snippet actions()}<Button
				size="sm"
				variant="outline"
				onclick={() => (compatibilityRun = !compatibilityRun)}
				>{compatibilityRun ? 'Stoppen' : 'Externe Motion'}</Button
			>{/snippet}
		<div class:running={compatibilityRun} class="compat-grid">
			<div>
				<span>Sicher: Consumer transformiert Wrapper</span>
				<div class="consumer-wrapper lab-loop"><Button>Button im Wrapper</Button></div>
			</div>
			<div>
				<span>Konflikt: Consumer transformiert Button</span><Button class="consumer-direct lab-loop"
					>Direkter Transform</Button
				>
			</div>
			<div>
				<span>Direkte Manipulation im externen Wrapper</span>
				<div class="consumer-wrapper lab-loop">
					<Slider type="single" min={0} max={100} value={55} />
				</div>
			</div>
			<div>
				<span>Card / Layout-Transform-Kollision</span>
				<article class="consumer-direct lab-loop">
					<strong>Externe Card</strong>
					<p>Transform kann nicht additiv garantiert werden.</p>
				</article>
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
	.mode-head {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1px;
		margin-bottom: 0.4rem;
		color: var(--muted-foreground);
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.mode-head strong {
		padding-left: 0.7rem;
	}
	.reduced-matrix {
		display: grid;
		gap: 0.35rem;
	}
	.mode-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.35rem;
	}
	.specimen {
		display: flex;
		min-height: 4rem;
		align-items: center;
		gap: 0.7rem;
		border-radius: 0.75rem;
		background: var(--background);
		padding: 0.7rem;
	}
	.specimen i {
		display: block;
		width: 2.2rem;
		height: 1.4rem;
		flex: none;
		border-radius: 0.45rem;
		background: var(--foreground);
	}
	.normal-specimen i {
		animation: specimen-move var(--motion-overlay) var(--ease-enter) infinite alternate;
	}
	.normal-specimen span,
	.reduced-specimen strong,
	.reduced-specimen small {
		display: block;
	}
	.normal-specimen span,
	.reduced-specimen strong {
		font-size: 0.7rem;
	}
	.reduced-specimen small {
		margin-top: 0.1rem;
		color: var(--muted-foreground);
		font-size: 0.6rem;
		line-height: 1.3;
	}
	.reduced-specimen i {
		animation: reduced-fade 1.2s linear infinite alternate;
	}
	.continuous-summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.7rem;
		color: var(--muted-foreground);
		font-size: 0.68rem;
	}
	.continuous-summary label {
		display: flex;
		align-items: center;
		gap: 0.35rem;
	}
	.continuous-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
		gap: 0.35rem;
	}
	.continuous-grid > div {
		display: grid;
		min-height: 4.5rem;
		align-content: center;
		justify-items: center;
		gap: 0.5rem;
		border-radius: 0.65rem;
		background: var(--background);
		padding: 0.5rem;
	}
	.continuous-grid span {
		color: var(--muted-foreground);
		font-family: ui-monospace, monospace;
		font-size: 0.55rem;
	}
	.continuous-grid.stopped :global(.lab-loop) {
		animation-play-state: paused;
	}
	.loaded-state {
		display: grid;
		min-height: 8rem;
		place-content: center;
		text-align: center;
	}
	.loaded-state span {
		margin-top: 0.2rem;
		color: var(--muted-foreground);
		font-size: 0.7rem;
	}
	.progress-row {
		display: grid;
		grid-template-columns: minmax(6rem, 1fr) auto minmax(8rem, 1fr);
		align-items: center;
		gap: 0.7rem;
		margin-top: 0.8rem;
	}
	.progress-row span {
		font-variant-numeric: tabular-nums;
		color: var(--muted-foreground);
		font-size: 0.68rem;
	}
	.perf-readout {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 0.35rem;
		margin-bottom: 0.6rem;
	}
	.perf-readout span {
		border-radius: 0.6rem;
		background: var(--background);
		padding: 0.55rem;
		color: var(--muted-foreground);
		font-size: 0.62rem;
	}
	.perf-readout strong {
		display: block;
		margin-top: 0.12rem;
		color: var(--foreground);
		font-size: 0.78rem;
	}
	.perf-note {
		margin-bottom: 0.6rem;
		color: var(--muted-foreground);
		font-size: 0.68rem;
	}
	.scale-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.35rem;
	}
	.scale-actions span {
		color: var(--muted-foreground);
		font-size: 0.68rem;
	}
	.scale-controls {
		display: grid;
		grid-template-columns: repeat(10, minmax(0, 1fr));
		gap: 0.25rem;
		margin-top: 0.6rem;
	}
	.scale-controls label {
		display: grid;
		justify-items: center;
		gap: 0.2rem;
		border-radius: 0.45rem;
		background: var(--background);
		padding: 0.35rem 0.15rem;
	}
	.scale-controls span {
		color: var(--muted-foreground);
		font-size: 0.5rem;
	}
	.stress-table {
		max-height: 24rem;
		overflow: auto;
		margin-top: 0.7rem;
		border: 1px solid var(--border);
		border-radius: 0.7rem;
		background: var(--background);
	}
	.table-head,
	.table-row {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		align-items: center;
		min-height: 2rem;
		padding: 0 0.6rem;
		font-size: 0.65rem;
	}
	.table-head {
		position: sticky;
		top: 0;
		z-index: 1;
		background: var(--muted);
		color: var(--muted-foreground);
		font-weight: 650;
	}
	.table-row {
		border-top: 1px solid var(--border);
	}
	.table-row[data-selected='true'] {
		background: color-mix(in oklab, var(--foreground), transparent 92%);
	}
	.table-row button {
		width: fit-content;
		border-radius: 0.3rem;
		padding: 0.2rem;
		text-align: left;
	}
	.table-row button:hover {
		background: var(--muted);
	}
	.table-detail {
		border-top: 1px solid var(--border);
		background: var(--muted);
		padding: 0.55rem 0.7rem;
		color: var(--muted-foreground);
		font-size: 0.62rem;
	}
	.compat-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.55rem;
	}
	.compat-grid > div {
		min-height: 8rem;
		overflow: hidden;
		border-radius: 0.8rem;
		background: var(--background);
		padding: 0.8rem;
	}
	.compat-grid > div > span {
		display: block;
		margin-bottom: 1.5rem;
		color: var(--muted-foreground);
		font-size: 0.65rem;
	}
	.compat-grid article {
		border: 1px solid var(--border);
		border-radius: 0.65rem;
		padding: 0.7rem;
	}
	.compat-grid article p {
		margin-top: 0.2rem;
		color: var(--muted-foreground);
		font-size: 0.65rem;
	}
	.running .consumer-wrapper {
		animation: consumer-motion 900ms var(--ease-move) infinite alternate;
	}
	.running .consumer-direct {
		animation: consumer-motion 900ms var(--ease-move) infinite alternate;
	}

	@keyframes specimen-move {
		from {
			transform: translateX(0) scale(0.96);
			opacity: 0.4;
		}
		to {
			transform: translateX(18px) scale(1);
			opacity: 1;
		}
	}
	@keyframes reduced-fade {
		from {
			opacity: 0.55;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes consumer-motion {
		to {
			transform: translateX(18px) rotate(2deg);
		}
	}
	@media (max-width: 48rem) {
		.scale-controls {
			grid-template-columns: repeat(5, 1fr);
		}
	}
	@media (max-width: 42rem) {
		.mode-row,
		.compat-grid {
			grid-template-columns: 1fr;
		}
		.mode-head {
			display: none;
		}
		.perf-readout {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
