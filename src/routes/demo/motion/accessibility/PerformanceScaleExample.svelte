<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';
	import { useMotionLabState } from '#lib/site/motion-lab/context.svelte.js';
	import { Button } from '#lib/bedrock/ui/button';
	import { Checkbox } from '#lib/bedrock/ui/checkbox';

	let { progress = $bindable() }: { progress: number } = $props();
	const lab = useMotionLabState();
	let selectedRows = new SvelteSet<number>();
	let expandedRows = new SvelteSet<number>();
	let scaleSwitches = $state(Array.from({ length: 50 }, (_, index) => index % 4 === 0));
	let tableRows = $state(
		Array.from({ length: 80 }, (_, index) => ({ id: index + 1, value: (index + 1) * 17 }))
	);
	let navIndex = $state(0);
	let performanceResult = $state<{
		frames: number;
		longFrames: number;
		maxGap: number;
		average: number;
	} | null>(null);
	let probeFrame = 0;
	let numericTimer = 0;
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
	});
	onDestroy(() => clearInterval(numericTimer));
</script>

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
				<button type="button" onclick={() => toggleRow(row.id)}>#{String(row.id).slice(-4)}</button
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

<style>
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

	@media (max-width: 48rem) {
		.scale-controls {
			grid-template-columns: repeat(5, 1fr);
		}
	}
	@media (max-width: 42rem) {
		.perf-readout {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
