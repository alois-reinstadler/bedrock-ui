<script lang="ts">
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';

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
		['Skeleton', 'Ladeanimation bleibt aktiv; statische Platzhalter sind explizit wählbar.'],
		['Navigation', 'Richtungstranslation entfällt; Inhalt wechselt mit Opacity.']
	] as const;
</script>

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

<style>
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

	@media (max-width: 42rem) {
		.mode-row {
			grid-template-columns: 1fr;
		}
		.mode-head {
			display: none;
		}
	}
</style>
