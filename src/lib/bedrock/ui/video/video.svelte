<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLVideoAttributes } from 'svelte/elements';
	import type { WithElementRef } from '#lib/utils.js';
	import type { VideoCaptionTrack } from '#lib/bedrock/ui/video-player';

	export type VideoProps = Omit<
		WithElementRef<HTMLVideoAttributes, HTMLVideoElement>,
		'children'
	> & {
		/** Accessible name for the video and its reserved frame. */
		label: string;
		/** Reserved width / height ratio. Defaults to width / height, then 16 / 9. */
		aspectRatio?: number;
		/** Classes for the video itself. class and style target the frame. */
		videoClass?: string;
		/** Minimum initial skeleton duration in milliseconds. Defaults to 0. */
		minimumLoadingDuration?: number;
		/** Caption tracks for spoken or otherwise meaningful audio. */
		captions?: VideoCaptionTrack[];
		/** Non-interactive replacement for a missing or failed video. */
		fallback?: Snippet;
		/** Button label when preload is deferred or the browser suspends loading. */
		loadLabel?: string;
	};
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { cn } from '#lib/utils.js';
	import { Skeleton } from '#lib/bedrock/ui/skeleton';
	import { Button } from '#lib/bedrock/ui/button';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';

	let {
		ref = $bindable(null),
		class: className,
		style,
		src,
		crossorigin,
		label,
		width,
		height,
		aspectRatio,
		videoClass,
		minimumLoadingDuration = 0,
		captions = [],
		fallback,
		loadLabel = 'Load video',
		preload = 'auto',
		controls = true,
		playsinline = true,
		...restProps
	}: VideoProps = $props();
	const policy = useMotionPolicy();
	const ratio = $derived.by(() => {
		if (aspectRatio && Number.isFinite(aspectRatio) && aspectRatio > 0) return aspectRatio;
		const intrinsic = Number(width) / Number(height);
		return Number.isFinite(intrinsic) && intrinsic > 0 ? intrinsic : 16 / 9;
	});
	const request = $derived({ src, crossorigin });
	const hasSource = $derived(Boolean(src?.trim()));
	let settled = $state.raw<{ request: typeof request; status: 'loaded' | 'error' } | null>(null);
	let suspendedRequest = $state.raw<typeof request | null>(null);
	let readyRequest = $state.raw<typeof request | null>(null);
	const status = $derived(
		!hasSource ? 'error' : settled?.request === request ? settled.status : 'loading'
	);
	const deferred = $derived(
		readyRequest !== request &&
			(preload === 'none' || preload === 'metadata' || suspendedRequest === request)
	);

	function observeVideo(element: HTMLVideoElement) {
		const currentRequest = request;
		const minimum = untrack(() =>
			Number.isFinite(minimumLoadingDuration) ? Math.max(0, minimumLoadingDuration) : 0
		);
		let started = performance.now();
		let cancelled = false;
		let failed = false;
		let revealTimer: ReturnType<typeof setTimeout> | undefined;
		if (untrack(() => ref) !== element) ref = element;

		function settle(next: 'loaded' | 'error') {
			if (!cancelled) settled = { request: currentRequest, status: next };
		}
		function loaded() {
			// Metadata alone does not guarantee a decoded frame. Do not wait for the whole file.
			if (cancelled || failed || element.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
			readyRequest = currentRequest;
			suspendedRequest = null;
			clearTimeout(revealTimer);
			const remaining = minimum - (performance.now() - started);
			if (remaining > 0) revealTimer = setTimeout(() => settle('loaded'), remaining);
			else settle('loaded');
		}
		function reset() {
			clearTimeout(revealTimer);
			started = performance.now();
			failed = false;
			settled = null;
			readyRequest = null;
			suspendedRequest = null;
		}
		function error() {
			failed = true;
			clearTimeout(revealTimer);
			settle('error');
		}
		function suspended() {
			if (element.readyState < HTMLMediaElement.HAVE_CURRENT_DATA)
				suspendedRequest = currentRequest;
		}
		const listeners = {
			loadeddata: loaded,
			canplay: loaded,
			playing: loaded,
			error,
			emptied: reset,
			loadstart: reset,
			suspend: suspended
		};
		for (const [name, listener] of Object.entries(listeners))
			element.addEventListener(name, listener);
		// Media can finish loading before hydration attaches listeners.
		if (element.error) error();
		else loaded();

		return () => {
			cancelled = true;
			clearTimeout(revealTimer);
			for (const [name, listener] of Object.entries(listeners))
				element.removeEventListener(name, listener);
			element.pause();
			element.removeAttribute('src');
			element.load();
			if (ref === element) ref = null;
		};
	}
	function loadVideo() {
		if (!ref) return;
		ref.preload = 'auto';
		ref.load();
	}
</script>

<div
	data-slot="video"
	data-state={status}
	role="group"
	aria-label={label}
	aria-busy={status === 'loading'}
	class={cn('relative isolate block w-full overflow-hidden rounded-md', className)}
	style={`aspect-ratio: ${ratio}; ${style ?? ''}`}
>
	{#if hasSource}
		{#key request}
			<video
				{...restProps}
				{...request}
				{width}
				{height}
				{preload}
				{controls}
				{playsinline}
				data-slot="video-content"
				aria-label={restProps['aria-label'] ?? label}
				aria-hidden={status !== 'loaded' ? true : restProps['aria-hidden']}
				inert={status !== 'loaded'}
				class={cn('absolute inset-0 size-full object-contain', videoClass)}
				style:opacity={status === 'loaded' ? 1 : 0}
				style:transition={policy.reduced
					? 'none'
					: 'opacity var(--motion-state, 175ms) var(--motion-ease-enter, ease-out)'}
				{@attach observeVideo}
			>
				{#each captions as track (track.src)}
					<track
						kind="captions"
						src={track.src}
						srclang={track.srclang}
						label={track.label}
						default={track.default}
					/>
				{/each}
			</video>
		{/key}
	{/if}
	{#if status === 'loading'}
		<Skeleton
			aria-hidden="true"
			class="pointer-events-none absolute inset-0 size-full rounded-none"
		/>
		{#if deferred}
			<div class="absolute inset-0 flex items-center justify-center">
				<Button variant="secondary" onclick={loadVideo}>{loadLabel}</Button>
			</div>
		{/if}
	{:else if status === 'error'}
		<span
			data-slot="video-fallback"
			role="status"
			class="absolute inset-0 flex items-center justify-center bg-muted p-4 text-center text-sm text-muted-foreground"
		>
			{#if fallback}{@render fallback()}{:else}Video unavailable{/if}
		</span>
	{/if}
</div>
