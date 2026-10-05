<script lang="ts" module>
	import type {
		VideoPlayerLabels as Labels,
		VideoSource as Source,
		VideoCaptionTrack as CaptionTrack
	} from './types.js';
	export type VideoPlayerLabels = Labels;
	export type VideoSource = Source;
	export type VideoCaptionTrack = CaptionTrack;
</script>

<script lang="ts">
	import { defaultLabels } from './types.js';
	import VideoControls from './video-controls.svelte';
	import { onDestroy, onMount, untrack } from 'svelte';
	import { clampVolume, gainToVolume, volumeToGain } from '#lib/bedrock/media/volume.js';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { Spinner } from '#lib/bedrock/ui/spinner';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { clampTime, formatTime } from './time-format.js';

	/**
	 * A product media surface with design-system controls (see the 2026-09-03
	 * VideoPlayer proposal). Progressive MP4/WebM only; adaptive streaming
	 * attaches through `mediaSetup` (e.g. hls.js) rather than shipping here.
	 */
	let {
		ref = $bindable(null),
		class: className,
		src,
		poster,
		label,
		captions = [],
		captionsTrack = $bindable(null),
		playbackRates = [1, 1.25, 1.5, 2],
		nativeControls = false,
		autoplay = false,
		muted = $bindable(false),
		loop = false,
		playsinline = true,
		preload = 'metadata',
		mediaSetup,
		onError,
		labels: labelOverrides = {},
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		src: VideoSource;
		poster?: string;
		/** Accessible name for the player region (required). */
		label: string;
		captions?: VideoCaptionTrack[];
		/** Index into `captions` of the showing track, or null when off. */
		captionsTrack?: number | null;
		playbackRates?: number[];
		/** Renders the platform's own controls instead of the Bedrock bar. */
		nativeControls?: boolean;
		autoplay?: boolean;
		muted?: boolean;
		loop?: boolean;
		playsinline?: boolean;
		preload?: 'none' | 'metadata' | 'auto';
		/** Escape hatch run with the media element (attach hls.js etc.);
		 * may return a cleanup. */
		mediaSetup?: (video: HTMLVideoElement) => void | (() => void);
		onError?: (error: MediaError | null) => void;
		labels?: VideoPlayerLabels;
	} = $props();

	const labels = $derived({ ...defaultLabels, ...labelOverrides });
	const sources = $derived(typeof src === 'string' ? [{ src, type: undefined }] : src);

	let video = $state<HTMLVideoElement | null>(null);
	let playing = $state(false);
	let volume = $state(1);
	let lastAudibleVolume = 1;
	let ended = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let buffering = $state(false);
	let failed = $state(false);
	let fullscreen = $state(false);
	let inPip = $state(false);
	let rate = $state(1);
	let announcement = $state('');
	let controlsIdle = $state(false);
	let bufferTimer: ReturnType<typeof setTimeout> | undefined;
	let idleTimer: ReturnType<typeof setTimeout> | undefined;

	const BUFFER_DELAY_MS = 150;
	const IDLE_HIDE_MS = 3000;
	const pipSupported =
		typeof document !== 'undefined' && 'pictureInPictureEnabled' in document
			? document.pictureInPictureEnabled
			: false;

	function announce(message: string) {
		announcement = message;
	}

	function togglePlay() {
		const media = video;
		if (!media) return;
		if (media.paused || media.ended) {
			// Autoplay-policy rejections surface as the paused state, never a throw.
			void media.play().catch(() => undefined);
		} else {
			media.pause();
		}
	}

	function seekBy(seconds: number) {
		const media = video;
		if (!media) return;
		media.currentTime = clampTime(media.currentTime + seconds, duration);
		announce(labels.seekedTo(formatTime(media.currentTime)));
	}

	function seekTo(seconds: number) {
		const media = video;
		if (!media) return;
		media.currentTime = clampTime(seconds, duration);
	}

	function syncVolume() {
		if (!video) return;
		volume = gainToVolume(video.volume);
		if (volume > 0) lastAudibleVolume = volume;
	}

	function setVolume(level: number) {
		if (!video) return;
		volume = clampVolume(level);
		video.volume = volumeToGain(volume);
		if (volume > 0) {
			lastAudibleVolume = volume;
			muted = false;
		}
	}

	function toggleMute() {
		if (muted || volume === 0) {
			if (volume === 0) setVolume(lastAudibleVolume);
			muted = false;
		} else muted = true;
	}

	function adjustVolume(delta: number) {
		setVolume((muted ? 0 : volume) + delta);
	}

	function cycleRate() {
		const media = video;
		if (!media || playbackRates.length === 0) return;
		const index = playbackRates.indexOf(rate);
		const next = playbackRates[(index + 1) % playbackRates.length];
		media.playbackRate = next;
		announce(labels.playbackRate(next));
	}

	function cycleCaptions() {
		if (captions.length === 0) return;
		captionsTrack =
			captionsTrack === null ? 0 : captionsTrack + 1 >= captions.length ? null : captionsTrack + 1;
		announce(
			captionsTrack === null ? labels.captionsOff : labels.captionsOn(captions[captionsTrack].label)
		);
	}

	function setRoot(element: HTMLDivElement) {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}

	function toggleFullscreen() {
		if (!ref) return;
		if (document.fullscreenElement === ref) void document.exitFullscreen();
		else void ref.requestFullscreen?.().catch(() => undefined);
	}

	function togglePip() {
		const media = video;
		if (!media) return;
		if (document.pictureInPictureElement === media) void document.exitPictureInPicture();
		else void media.requestPictureInPicture?.().catch(() => undefined);
	}

	function retry() {
		failed = false;
		video?.load();
	}

	// Text-entry surfaces keep their keys; everything else inside the player
	// gets the shortcut map.
	function isTypingTarget(target: EventTarget | null): boolean {
		return (
			target instanceof HTMLElement &&
			(target instanceof HTMLInputElement ||
				target instanceof HTMLTextAreaElement ||
				target.isContentEditable)
		);
	}

	function onKeydown(event: KeyboardEvent) {
		if (nativeControls || event.defaultPrevented || isTypingTarget(event.target)) return;
		const large = event.shiftKey ? 30 : 5;
		const handled = () => event.preventDefault();
		switch (event.key) {
			case ' ':
			case 'k':
				// Space on a focused button already toggles via click.
				if (event.key === ' ' && event.target instanceof HTMLButtonElement) return;
				togglePlay();
				return handled();
			case 'ArrowLeft':
				seekBy(-large);
				return handled();
			case 'ArrowRight':
				seekBy(large);
				return handled();
			case 'j':
				seekBy(-10);
				return handled();
			case 'l':
				seekBy(10);
				return handled();
			case 'ArrowUp':
				adjustVolume(0.05);
				return handled();
			case 'ArrowDown':
				adjustVolume(-0.05);
				return handled();
			case 'm':
				toggleMute();
				return handled();
			case 'f':
				toggleFullscreen();
				return handled();
			case 'p':
				if (pipSupported) togglePip();
				return handled();
			case 'c':
				cycleCaptions();
				return handled();
			case 'Home':
				seekTo(0);
				return handled();
			case 'End':
				seekTo(duration);
				return handled();
		}
	}

	function wake() {
		controlsIdle = false;
		clearTimeout(idleTimer);
		if (fullscreen && playing) {
			idleTimer = setTimeout(() => {
				controlsIdle = !ref?.contains(document.activeElement);
			}, IDLE_HIDE_MS);
		}
	}

	function setVideo(element: HTMLVideoElement) {
		return untrack(() => {
			video = element;
			syncVolume();
			// Metadata can load before hydration attaches the listeners.
			duration = Number.isFinite(element.duration) ? element.duration : 0;
			currentTime = element.currentTime;
			rate = element.playbackRate;
			playing = !element.paused && !element.ended;
			// Svelte's element typings don't know the PiP events yet.
			const onEnterPip = () => (inPip = true);
			const onLeavePip = () => (inPip = false);
			element.addEventListener('enterpictureinpicture', onEnterPip);
			element.addEventListener('leavepictureinpicture', onLeavePip);
			const cleanupSetup = mediaSetup?.(element);
			return () => {
				element.removeEventListener('enterpictureinpicture', onEnterPip);
				element.removeEventListener('leavepictureinpicture', onLeavePip);
				cleanupSetup?.();
				if (video === element) video = null;
			};
		});
	}

	// Applies the controlled captions selection to the native tracks.
	$effect(() => {
		const media = video;
		const selected = captionsTrack;
		if (!media) return;
		for (let index = 0; index < media.textTracks.length; index += 1) {
			media.textTracks[index].mode = index === selected ? 'showing' : 'hidden';
		}
	});

	onMount(() => {
		const onFullscreenChange = () => {
			fullscreen = document.fullscreenElement === ref;
			wake();
		};
		document.addEventListener('fullscreenchange', onFullscreenChange);
		return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
	});

	onDestroy(() => {
		clearTimeout(bufferTimer);
		clearTimeout(idleTimer);
	});

	const showBar = $derived(!nativeControls && !failed);
</script>

<div
	{@attach setRoot}
	data-slot="video-player"
	role="group"
	aria-label={label}
	class={cn(
		'group/video @container relative overflow-hidden rounded-xl border bg-black text-white',
		className
	)}
	onkeydown={onKeydown}
	onpointermove={wake}
	onfocusin={wake}
	onfocusout={wake}
	{...restProps}
>
	<video
		{@attach setVideo}
		class="block aspect-video w-full"
		{poster}
		{autoplay}
		{loop}
		{playsinline}
		{preload}
		bind:muted
		onvolumechange={syncVolume}
		controls={nativeControls}
		onclick={() => {
			if (!nativeControls) togglePlay();
		}}
		onplay={() => {
			playing = true;
			ended = false;
			announce(labels.playing);
			wake();
		}}
		onpause={() => {
			playing = false;
			announce(labels.paused);
			wake();
		}}
		onended={() => {
			ended = true;
			playing = false;
		}}
		ontimeupdate={() => (currentTime = video?.currentTime ?? 0)}
		ondurationchange={() => (duration = video?.duration ?? 0)}
		onratechange={() => (rate = video?.playbackRate ?? 1)}
		onwaiting={() => {
			clearTimeout(bufferTimer);
			bufferTimer = setTimeout(() => (buffering = true), BUFFER_DELAY_MS);
		}}
		onplaying={() => {
			clearTimeout(bufferTimer);
			buffering = false;
		}}
		oncanplay={() => {
			clearTimeout(bufferTimer);
			buffering = false;
		}}
		onerror={() => {
			failed = true;
			onError?.(video?.error ?? null);
		}}
	>
		{#each sources as source (source.src)}
			<source src={source.src} type={source.type} />
		{/each}
		{#each captions as track, index (track.src)}
			<track
				kind="captions"
				src={track.src}
				srclang={track.srclang}
				label={track.label}
				default={track.default || index === captionsTrack}
			/>
		{/each}
	</video>

	{#if inPip}
		<div
			class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 text-sm"
		>
			<Icon icon="pip" class="size-6" />
			{labels.pipPlaceholder}
			<button
				type="button"
				class="tap-target rounded-md border border-white/30 px-3 py-1 text-sm motion-state hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
				onclick={togglePip}>{labels.pipReturn}</button
			>
		</div>
	{/if}

	{#if buffering && !failed}
		<div
			class="pointer-events-none absolute inset-0 flex items-center justify-center"
			aria-hidden="true"
		>
			<Spinner class="size-8 text-white" />
		</div>
	{/if}

	{#if failed}
		<div
			class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 text-sm"
			role="alert"
		>
			<Icon icon="error" class="size-6 text-red-400" />
			{labels.error}
			<button
				type="button"
				class="tap-target rounded-md border border-white/30 px-3 py-1 text-sm motion-state hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
				onclick={retry}>{labels.retry}</button
			>
		</div>
	{/if}

	{#if showBar}
		<VideoControls
			{labels}
			{controlsIdle}
			{ended}
			{playing}
			{duration}
			{currentTime}
			{muted}
			{volume}
			{playbackRates}
			{rate}
			{captions}
			{captionsTrack}
			{pipSupported}
			{fullscreen}
			{togglePlay}
			{seekTo}
			{seekBy}
			{setVolume}
			{toggleMute}
			{cycleRate}
			{cycleCaptions}
			{togglePip}
			{toggleFullscreen}
		/>
	{/if}

	<span class="sr-only" role="status" data-slot="video-player-status">{announcement}</span>
</div>
