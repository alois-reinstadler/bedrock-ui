<script lang="ts">
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';

	import { Button } from '#lib/bedrock/ui/button';

	let monthOffset = $state(0);
	let direction = $state<1 | -1>(1);
	let pageIndex = $state(1);
	function navigate(delta: 1 | -1) {
		direction = delta;
		monthOffset += delta;
		pageIndex = Math.max(1, Math.min(9, pageIndex + delta));
	}
	function monthLabel(offset: number) {
		const date = new Date(2026, 7 + offset, 1);
		return new Intl.DateTimeFormat('de-AT', { month: 'long', year: 'numeric' }).format(date);
	}
</script>

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
			<Button size="sm" variant="outline" aria-label="Vorheriger Monat" onclick={() => navigate(-1)}
				>← Zurück</Button
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

<style>
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

	@keyframes navigate-in {
		from {
			transform: translateX(var(--travel, 24px));
			opacity: 0;
		}
	}
</style>
