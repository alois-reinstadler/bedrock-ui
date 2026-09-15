<script lang="ts">
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';
	import { motionPresets, springEase, swapSpringEase } from '#lib/bedrock/motion/index.js';

	let run = $state(0);
	let groupSize = $state<3 | 10 | 50>(10);
	let showGroup = $state(true);

	const durations = [
		['Press', 'press', motionPresets.press.duration],
		['State', 'state', motionPresets.state.duration],
		['Enter', 'enter', motionPresets.enter.duration],
		['Exit', 'exit', motionPresets.exit.duration],
		['Reveal', 'reveal', motionPresets.reveal.duration],
		['Overlay', 'overlay', motionPresets.overlay.duration],
		['Continuous', '—', 900]
	] as const;

	function sampleEasing(easing: (time: number) => number) {
		return `linear(${Array.from({ length: 25 }, (_, index) => easing(index / 24).toFixed(4)).join(', ')})`;
	}

	const curves = [
		['Enter', `cubic-bezier(${motionPresets.enter.easing.join(', ')})`],
		['Exit', `cubic-bezier(${motionPresets.exit.easing.join(', ')})`],
		['Movement', `cubic-bezier(${motionPresets.move.easing.join(', ')})`],
		['Drawer', `cubic-bezier(${motionPresets.drawer.easing.join(', ')})`],
		['Layout spring', sampleEasing(springEase)],
		['Swap spring', sampleEasing(swapSpringEase)],
		['Linear', 'linear']
	] as const;

	const distances = [
		['Kontext', 2],
		['Anker', 8],
		['Fläche', 24],
		['Drawer', 80]
	] as const;

	const origins = [
		['Mitte', '50% 50%'],
		['Trigger oben links', '12% 0%'],
		['Trigger unten', '50% 100%'],
		['Kante rechts', '100% 50%']
	] as const;
</script>

<div class="page-stack">
	<header class="page-heading">
		<p>01 · Grundlagen</p>
		<h2>Gleiche Geometrie, andere semantische Aufgabe</h2>
		<span
			>Komplexität bleibt bewusst niedrig, damit Dauer, Kurve, Distanz und Ursprung isoliert
			vergleichbar sind.</span
		>
	</header>

	<Benchmark
		id="duration-comparison"
		title="Dauervergleich"
		summary="Jeder Punkt legt dieselbe Distanz zurück. Nur der semantische Zeitwert ändert sich."
		hardCase="Mehrere Rollen gleichzeitig starten. Prüfen, ob Press wie Feedback und Overlay wie visuelles Gewicht wirkt – nicht bloß schnell beziehungsweise langsam."
		metadata={{
			role: 'Zustandswechsel',
			duration: 'motionPresets.press → overlay',
			easing: 'linear (isolierter Dauervergleich)',
			distance: '160 px',
			properties: 'transform',
			layout: 'Nein',
			loop: 'Nein',
			reduced: 'Alle Punkte springen ins Ziel; Beschriftung bleibt erhalten.'
		}}
	>
		{#snippet actions()}<button type="button" onclick={() => (run += 1)}>Abspielen</button
			>{/snippet}
		{#key run}
			<div class="tracks">
				{#each durations as [label, token, duration] (label)}
					<div class="track-row">
						<span><strong>{label}</strong><small>{token} · {duration} ms</small></span>
						<div class="track">
							<i class="runner lab-animated lab-spatial" style:--duration={`${duration}ms`}></i>
						</div>
					</div>
				{/each}
			</div>
		{/key}
	</Benchmark>

	<Benchmark
		id="easing-comparison"
		title="Kurven- und Federvergleich"
		summary="Gleiche Dauer und Distanz. Die beiden Federn werden direkt aus Bedrocks Easing-Funktionen als CSS linear()-Samples erzeugt."
		hardCase="Bewegung nach der Hälfte umkehren. Kurven mit starkem Anlauf zeigen, ob eine neue Zielrichtung zunächst gegen die sichtbare Geschwindigkeit arbeitet."
		metadata={{
			role: 'Bewegung / Kontinuität',
			duration: 'motionPresets.layout.duration · 500 ms',
			easing: 'enter, exit, move, drawer, layout spring, swap spring, linear',
			distance: '160 px',
			properties: 'transform',
			layout: 'Nein',
			loop: 'Nein',
			reduced: 'Translation entfernt; Endzustand bleibt eindeutig.'
		}}
	>
		{#snippet actions()}<button type="button" onclick={() => (run += 1)}>Abspielen</button
			>{/snippet}
		{#key run}
			<div class="tracks">
				{#each curves as [label, curve] (label)}
					<div class="track-row">
						<span
							><strong>{label}</strong><small
								>{label.includes('spring') ? 'Bedrock spring' : curve}</small
							></span
						>
						<div class="track">
							<i
								class="runner lab-animated lab-spatial"
								style:--duration={`${motionPresets.layout.duration}ms`}
								style:--curve={curve}
							></i>
						</div>
					</div>
				{/each}
			</div>
		{/key}
	</Benchmark>

	<Benchmark
		id="distance-comparison"
		title="Distanz und visuelles Gewicht"
		summary="Vier Flächen verwenden dieselbe Eintrittskurve, aber Distanzen von einer Mikroverschiebung bis zur großen Fläche."
		hardCase="Große Distanz mit kurzer Dauer vergleichen. Wenn die Fläche fliegt, fehlt ein semantischer Distanz- oder Gewichtstoken."
		verdict="problem"
		finding="Bedrock besitzt keine gemeinsamen Distanz-Tokens. Die Werte im Lab sind Diagnosewerte, keine neue Systemvorgabe."
		metadata={{
			role: 'Eintritt',
			duration: 'motionPresets.enter · 230 ms',
			easing: 'motionEasings.enter',
			distance: '2 / 8 / 24 / 80 px (Lab-Probe)',
			properties: 'transform, opacity',
			layout: 'Nein',
			loop: 'Nein',
			reduced: 'Translation entfällt; 80 ms Opacity bleibt als Zustandsbestätigung.'
		}}
	>
		{#key run}
			<div class="distance-grid">
				{#each distances as [label, distance] (label)}
					<div>
						<span>{label} · {distance}px</span><i
							class="distance-card lab-animated lab-spatial"
							style:--distance={`${distance}px`}
						></i>
					</div>
				{/each}
			</div>
		{/key}
	</Benchmark>

	<Benchmark
		id="origin-comparison"
		title="Maßstab und Transform-Ursprung"
		summary="Subtiles scale(0.96) plus Opacity verbindet Kontextflächen mit Trigger oder Kante, ohne den cartoonhaften scale(0)-Effekt."
		hardCase="Ursprung nach einer Collision-Flip-Position wechseln. Öffnen und sofort schließen, bevor der neue Ursprung vollständig sichtbar ist."
		verdict="beobachten"
		metadata={{
			role: 'Eintritt',
			duration: 'motionPresets.enter · 230 ms',
			easing: 'motionEasings.enter',
			distance: 'scale 0.96 → 1',
			origin: 'Mitte / Trigger / Unterkante / rechte Kante',
			properties: 'transform, opacity',
			layout: 'Nein',
			loop: 'Nein',
			reduced: 'Skalierung entfernt, Opacity bleibt.'
		}}
	>
		{#key run}
			<div class="origin-grid">
				{#each origins as [label, origin] (label)}
					<div>
						<span>{label}</span><i
							class="origin-card lab-animated lab-spatial"
							style:transform-origin={origin}
						></i>
					</div>
				{/each}
			</div>
		{/key}
	</Benchmark>

	<Benchmark
		id="stagger-groups"
		title="Staffelung unter Gruppendruck"
		summary="3, 10 oder 50 Elemente starten mit demselben 22-ms-Versatz. Der Test zeigt, wann die Gruppe zur Warteschlange wird."
		hardCase="Elternfläche schließen, während 50 Kinder noch eintreten. Kein verzögertes Kind darf später wieder sichtbar werden."
		verdict={groupSize === 50 ? 'problem' : 'beobachten'}
		finding="Eine feste Staffelung skaliert nicht: Bei 50 Elementen beginnt das letzte erst nach mehr als einer Sekunde. Für dichte Ergebnisse sollte sie entfallen oder gedeckelt werden."
		metadata={{
			role: 'Gruppe / Staffelung',
			duration: 'motionPresets.enter · 230 ms',
			easing: 'motionEasings.enter',
			delay: 'index × 22 ms (Lab-Probe)',
			distance: '8 px',
			properties: 'transform, opacity',
			layout: 'Nein',
			loop: 'Nein',
			reduced: 'Keine Staffelung; Inhalte erscheinen gemeinsam mit kurzer Opacity.'
		}}
	>
		{#snippet actions()}
			<button type="button" onclick={() => (showGroup = !showGroup)}
				>{showGroup ? 'Gruppe schließen' : 'Gruppe öffnen'}</button
			>
		{/snippet}
		<div class="group-controls" role="group" aria-label="Gruppengröße">
			{#each [3, 10, 50] as size (size)}
				<button
					type="button"
					aria-pressed={groupSize === size}
					onclick={() => {
						groupSize = size as typeof groupSize;
						showGroup = true;
					}}>{size} Elemente</button
				>
			{/each}
		</div>
		{#if showGroup}
			<div class="stagger-grid">
				{#each Array.from(Array(groupSize).keys()) as index (index)}
					<i class="stagger-item lab-animated lab-spatial" style:--index={index}>{index + 1}</i>
				{/each}
			</div>
		{:else}
			<p class="empty">Gruppe geschlossen. Es dürfen keine verzögerten Eintritte nachlaufen.</p>
		{/if}
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
		max-width: 60ch;
		margin-top: 0.75rem;
		color: var(--muted-foreground);
		font-size: 0.86rem;
		line-height: 1.55;
	}
	.tracks {
		display: grid;
		gap: 0.55rem;
	}
	.track-row {
		display: grid;
		grid-template-columns: minmax(7rem, 0.28fr) 1fr;
		align-items: center;
		gap: 1rem;
	}
	.track-row span,
	.track-row strong,
	.track-row small {
		display: block;
	}
	.track-row strong {
		font-size: 0.75rem;
	}
	.track-row small {
		margin-top: 0.08rem;
		overflow: hidden;
		color: var(--muted-foreground);
		font-family: ui-monospace, monospace;
		font-size: 0.58rem;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.track {
		position: relative;
		height: 1.5rem;
		border-radius: 999px;
		background: color-mix(in oklab, var(--border), transparent 35%);
	}
	.track::after {
		position: absolute;
		inset-block: 0.3rem;
		right: 0.4rem;
		width: 1px;
		background: var(--muted-foreground);
		content: '';
		opacity: 0.5;
	}
	.runner {
		--curve: linear;
		position: absolute;
		top: 0.25rem;
		left: 0.25rem;
		width: 1rem;
		height: 1rem;
		border-radius: 50%;
		background: var(--foreground);
		animation: travel calc(var(--duration) * var(--lab-time-scale)) var(--curve) both;
	}
	.distance-grid,
	.origin-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 0.65rem;
	}
	.distance-grid > div,
	.origin-grid > div {
		display: grid;
		min-height: 8rem;
		place-items: center;
		overflow: hidden;
		border-radius: 0.9rem;
		background: var(--background);
		padding: 0.75rem;
	}
	.distance-grid span,
	.origin-grid span {
		color: var(--muted-foreground);
		font-size: 0.66rem;
	}
	.distance-card,
	.origin-card {
		display: block;
		width: 70%;
		height: 2.8rem;
		border: 1px solid var(--border);
		border-radius: 0.7rem;
		background: var(--card);
		box-shadow: 0 14px 25px -20px rgb(0 0 0 / 0.5);
	}
	.distance-card {
		animation: distance-enter var(--motion-enter) var(--ease-enter) both;
	}
	.origin-card {
		animation: origin-enter var(--motion-enter) var(--ease-enter) both;
	}
	.group-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin-bottom: 0.8rem;
	}
	.group-controls button {
		border-radius: 999px;
		background: var(--background);
		padding: 0.4rem 0.7rem;
		color: var(--muted-foreground);
		font-size: 0.7rem;
	}
	.group-controls button[aria-pressed='true'] {
		background: var(--foreground);
		color: var(--background);
	}
	.stagger-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(2.2rem, 1fr));
		gap: 0.35rem;
	}
	.stagger-item {
		display: grid;
		min-height: 2.2rem;
		place-items: center;
		border-radius: 0.55rem;
		background: var(--background);
		color: var(--muted-foreground);
		font-size: 0.65rem;
		font-style: normal;
		animation: stagger-enter var(--motion-enter) var(--ease-enter) both;
		animation-delay: calc(var(--index) * 22ms * var(--lab-time-scale));
	}
	.empty {
		color: var(--muted-foreground);
		font-size: 0.75rem;
	}

	@keyframes travel {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(calc(100cqw - 1.5rem));
		}
	}
	@keyframes distance-enter {
		from {
			transform: translateY(var(--distance));
			opacity: 0;
		}
	}
	@keyframes origin-enter {
		from {
			transform: scale(0.96);
			opacity: 0;
		}
	}
	@keyframes stagger-enter {
		from {
			transform: translateY(8px);
			opacity: 0;
		}
	}
	.track {
		container-type: inline-size;
	}

	@media (max-width: 48rem) {
		.distance-grid,
		.origin-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (max-width: 34rem) {
		.track-row {
			grid-template-columns: 1fr;
			gap: 0.25rem;
		}
	}
</style>
