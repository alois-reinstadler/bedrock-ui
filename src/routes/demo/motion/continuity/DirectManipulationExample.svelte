<script lang="ts">
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';

	import { Slider } from '#lib/bedrock/ui/slider';

	import * as Resizable from '#lib/bedrock/ui/resizable';

	let sliderValue = $state(38);
	let dragX = $state(0);
	let dragging = $state(false);
	let settling = $state(false);
	let dragOrigin = 0;
	let pointerOrigin = 0;
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
</script>

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
			class={['drag-handle lab-spatial', { dragging: dragging, settling: settling }]}
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

<style>
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

	@media (max-width: 42rem) {
		.manipulation-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
