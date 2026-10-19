<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { usePlayer } from '#lib/templates/music-player/player.svelte.js';
	import ListeningHeader from '#lib/templates/music-player/ListeningHeader.svelte';
	import { decodeSpectrum, type Spectrum } from '#lib/templates/music-player/spectrum.js';
	import { mountVisualizer, type VisualMode } from '#lib/templates/music-player/visualizer.js';
	const player = usePlayer();
	let mode = $state<VisualMode>('orbit');
	let still = $state(false);
	let spectrum = $state.raw<Spectrum | null>(null);
	let status = $state<'loading' | 'ready' | 'error'>('loading');
	let retry = $state(0);
	const modes = [
		{ id: 'orbit', label: 'Orbit' },
		{ id: 'ribbons', label: 'Ribbons' },
		{ id: 'mirror', label: 'Mirror' }
	] as const;
	function connectSpectrum() {
		const id = player.current.id;
		void retry;
		const controller = new AbortController();
		spectrum = null;
		status = 'loading';
		fetch(`/templates/music-player/spectra/${id}.bin`, { signal: controller.signal })
			.then((response) => {
				if (!response.ok) throw new Error('Spectrum unavailable');
				return response.arrayBuffer();
			})
			.then((buffer) => {
				if (!controller.signal.aborted) {
					spectrum = decodeSpectrum(buffer);
					status = 'ready';
				}
			})
			.catch(() => {
				if (!controller.signal.aborted) status = 'error';
			});
		return () => controller.abort();
	}
</script>

<svelte:head><title>Visualizer · {player.current.title} — Drift</title></svelte:head>
<section {@attach connectSpectrum} class="visualizer-screen" aria-label="Audio visualizer">
	<ListeningHeader label="See the sound" detail="In sync with your music" />
	<div class="visual-stage">
		<canvas
			{@attach (canvas) =>
				mountVisualizer(canvas, {
					spectrum,
					mode,
					still,
					playing: player.playing,
					audio: player.audio
				})}
			aria-label={`${mode} audio spectrum`}
		></canvas>
		{#if status === 'loading'}<p class="visual-status" role="status">Preparing the visuals…</p>
		{:else if status === 'error'}<div class="visual-status" role="status">
				<p>Visuals couldn’t load.</p>
				<Button variant="secondary" onclick={() => retry++}>Try again</Button>
			</div>
		{:else if !player.playing}<div class="visual-status">
				<Button variant="secondary" onclick={() => player.toggle()}>Play to feel the music</Button>
			</div>{/if}
	</div>
	<footer>
		<div class="mode-picker" role="group" aria-label="Visualization style">
			{#each modes as item (item.id)}<Button
					variant="ghost"
					aria-pressed={mode === item.id}
					class={['visual-mode', { chosen: mode === item.id }]}
					onclick={() => (mode = item.id)}>{item.label}</Button
				>{/each}
		</div>
		<Button
			variant="ghost"
			size="sm"
			class="freeze-visuals"
			aria-pressed={still}
			onclick={() => (still = !still)}>{still ? 'Resume visuals' : 'Freeze visuals'}</Button
		>
	</footer>
</section>

<style>
	.visualizer-screen {
		height: 100%;
		min-height: 0;
		display: flex;
		flex-direction: column;
		color: #fdf1f6;
		background: radial-gradient(ellipse at 85% 0%, #332638, transparent 65%), #110f18;
	}
	.visual-stage {
		position: relative;
		flex: 1;
		min-height: 160px;
		overflow: hidden;
	}
	canvas {
		display: block;
		width: 100%;
		height: 100%;
		position: absolute;
		inset: 0;
	}
	.visual-status {
		position: absolute;
		bottom: 18px;
		left: 0;
		right: 0;
		text-align: center;
		font-size: 13px;
		color: #dbbfcc;
	}
	.visual-status p {
		margin-bottom: 12px;
	}
	footer {
		padding: 18px 24px 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 24px;
		flex-wrap: wrap;
	}
	.mode-picker {
		display: flex;
		padding: 4px;
		border: 1px solid #ffffff20;
		border-radius: 99px;
		background: #ffffff06;
	}
	.mode-picker :global(.visual-mode) {
		border-radius: 99px;
		color: #cfbac7;
		padding-inline: 22px;
	}
	.mode-picker :global(.chosen) {
		color: #fff;
		background: #ffffff18;
	}
	:global(.freeze-visuals) {
		color: #cfbac7;
	}
	@media (max-width: 680px) {
		footer {
			gap: 8px;
			padding: 10px 12px;
		}
		.mode-picker :global(.visual-mode) {
			padding-inline: 18px;
		}
	}
</style>
