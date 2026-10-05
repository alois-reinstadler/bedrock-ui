<script lang="ts">
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import { cn } from '#lib/utils.js';
	import { formatTime } from './time-format.js';
	import type { defaultLabels, VideoCaptionTrack } from './types.js';
	let {
		labels,
		controlsIdle,
		ended,
		playing,
		duration,
		currentTime,
		muted,
		volume,
		playbackRates,
		rate,
		captions,
		captionsTrack,
		pipSupported,
		fullscreen,
		togglePlay,
		seekTo,
		seekBy,
		setVolume,
		toggleMute,
		cycleRate,
		cycleCaptions,
		togglePip,
		toggleFullscreen
	}: {
		labels: typeof defaultLabels;
		controlsIdle: boolean;
		ended: boolean;
		playing: boolean;
		muted: boolean;
		pipSupported: boolean;
		fullscreen: boolean;
		duration: number;
		currentTime: number;
		volume: number;
		rate: number;
		playbackRates: number[];
		captions: VideoCaptionTrack[];
		captionsTrack: number | null;
		togglePlay: () => void;
		toggleMute: () => void;
		cycleRate: () => void;
		cycleCaptions: () => void;
		togglePip: () => void;
		toggleFullscreen: () => void;
		seekTo: (seconds: number) => void;
		seekBy: (seconds: number) => void;
		setVolume: (volume: number) => void;
	} = $props();
	const progressRatio = $derived(duration > 0 ? currentTime / duration : 0);
	// Scrubber: pointer capture with click-to-jump (the ColorPicker rail
	// pattern); dragging commits continuously and never animates.
	function scrubberPointer(node: HTMLElement) {
		const move = (event: PointerEvent) => {
			const rect = node.getBoundingClientRect();
			const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
			seekTo(ratio * duration);
		};
		const down = (event: PointerEvent) => {
			node.setPointerCapture(event.pointerId);
			move(event);
		};
		const drag = (event: PointerEvent) => {
			if (node.hasPointerCapture(event.pointerId)) move(event);
		};
		node.addEventListener('pointerdown', down);
		node.addEventListener('pointermove', drag);
		return () => {
			node.removeEventListener('pointerdown', down);
			node.removeEventListener('pointermove', drag);
		};
	}

	function onScrubberKeydown(event: KeyboardEvent) {
		const step = event.key.startsWith('Page') ? 30 : 5;
		if (event.key === 'ArrowLeft' || event.key === 'PageDown') seekBy(-step);
		else if (event.key === 'ArrowRight' || event.key === 'PageUp') seekBy(step);
		else if (event.key === 'Home') seekTo(0);
		else if (event.key === 'End') seekTo(duration);
		else return;
		event.preventDefault();
		// The root shortcut map must not seek a second time.
		event.stopPropagation();
	}
</script>

<div
	data-slot="video-player-controls"
	class={cn(
		'media-controls absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-1 bg-gradient-to-t from-black/80 to-transparent px-2 pt-8 pb-1.5 transition-opacity duration-[var(--motion-state)] focus-within:pointer-events-auto focus-within:opacity-100 focus-within:transition-none',
		controlsIdle && 'pointer-events-none opacity-0'
	)}
>
	<IconButton
		icon={ended ? 'play' : playing ? 'pause' : 'play'}
		label={ended ? labels.replay : playing ? labels.pause : labels.play}
		variant="ghost"
		size="sm"
		class="text-white hover:bg-white/15 hover:text-white"
		onclick={togglePlay}
	/>
	<div
		{@attach scrubberPointer}
		role="slider"
		tabindex="0"
		aria-label={labels.scrubber}
		aria-valuemin={0}
		aria-valuemax={Math.round(duration)}
		aria-valuenow={Math.round(currentTime)}
		aria-valuetext={labels.timeOf(formatTime(currentTime), formatTime(duration))}
		aria-orientation="horizontal"
		data-slot="video-player-scrubber"
		class="media-seek tap-target relative mx-1 h-1.5 min-w-0 flex-1 cursor-pointer rounded-full bg-white/25 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
		onkeydown={onScrubberKeydown}
	>
		<span
			class="absolute inset-y-0 left-0 rounded-full bg-white"
			style:width="{progressRatio * 100}%"
			aria-hidden="true"
		></span>
	</div>
	<span class="media-time px-1 font-code text-[11px] whitespace-nowrap text-white/90 tabular-nums">
		{labels.timeOf(formatTime(currentTime), formatTime(duration))}
	</span>
	<div class="volume-control">
		<IconButton
			icon={muted || volume === 0 ? 'volumeMuted' : 'volume'}
			label={muted || volume === 0 ? labels.unmute : labels.mute}
			variant="ghost"
			size="sm"
			class="text-white hover:bg-white/15 hover:text-white"
			onclick={toggleMute}
		/>
		<input
			type="range"
			min="0"
			max="100"
			step="1"
			value={muted ? 0 : Math.round(volume * 100)}
			aria-label={labels.volume}
			aria-valuetext={muted ? 'Muted' : `${Math.round(volume * 100)}%`}
			data-slot="video-player-volume"
			oninput={(event) => setVolume(Number(event.currentTarget.value) / 100)}
		/>
	</div>
	{#if playbackRates.length > 1}
		<button
			type="button"
			class="tap-target rounded-md px-1.5 py-0.5 font-code text-[11px] motion-state hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
			aria-label={labels.playbackRate(rate)}
			onclick={cycleRate}>{rate}×</button
		>
	{/if}
	{#if captions.length > 0}
		<IconButton
			icon="captions"
			label={captionsTrack === null
				? labels.captionsOff
				: labels.captionsOn(captions[captionsTrack].label)}
			variant="ghost"
			size="sm"
			class={cn(
				'text-white hover:bg-white/15 hover:text-white',
				captionsTrack !== null && 'bg-white/20'
			)}
			onclick={cycleCaptions}
		/>
	{/if}
	{#if pipSupported}
		<IconButton
			icon="pip"
			label={labels.pip}
			variant="ghost"
			size="sm"
			class="text-white hover:bg-white/15 hover:text-white"
			onclick={togglePip}
		/>
	{/if}
	<IconButton
		icon={fullscreen ? 'exitFullscreen' : 'fullscreen'}
		label={fullscreen ? labels.exitFullscreen : labels.fullscreen}
		variant="ghost"
		size="sm"
		class="text-white hover:bg-white/15 hover:text-white"
		onclick={toggleFullscreen}
	/>
</div>

<style>
	.volume-control {
		display: flex;
		align-items: center;
		gap: 4px;
		flex-shrink: 0;
	}
	.volume-control input {
		width: 76px;
		height: 28px;
		accent-color: white;
		cursor: pointer;
	}
	.volume-control input:focus-visible {
		outline: 2px solid white;
		outline-offset: 2px;
		border-radius: 4px;
	}
	@container (max-width: 540px) {
		.media-seek {
			order: -2;
			flex: 1 0 calc(100% - 130px);
		}
		.media-time {
			order: -1;
			font-size: 10px;
		}
		.volume-control {
			margin-right: auto;
		}
		.volume-control input {
			width: 52px;
		}
	}
</style>
