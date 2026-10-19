<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLImgAttributes } from 'svelte/elements';
	import type { WithElementRef } from '#lib/utils.js';

	export type ImageProps = Omit<
		WithElementRef<HTMLImgAttributes, HTMLImageElement>,
		'children' | 'alt'
	> & {
		/** Describe the image, or use an empty string for decorative images. */
		alt: string;
		/** Reserved width / height ratio. Defaults to width / height, then 16 / 9. */
		aspectRatio?: number;
		/** Classes for the img itself (for example object-contain). class and style target the frame. */
		imageClass?: string;
		/** Minimum loading-skeleton duration in milliseconds. Defaults to 0; demos can opt into a delay. */
		minimumLoadingDuration?: number;
		/** Non-interactive replacement for an absent or failed image. Retains the image's alt text. */
		fallback?: Snippet;
	};
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { cn } from '#lib/utils.js';
	import { Skeleton } from '#lib/bedrock/ui/skeleton';

	let {
		ref = $bindable(null),
		class: className,
		style,
		src,
		srcset,
		sizes,
		crossorigin,
		referrerpolicy,
		alt,
		width,
		height,
		aspectRatio,
		imageClass,
		minimumLoadingDuration = 0,
		fallback,
		decoding = 'async',
		...restProps
	}: ImageProps = $props();

	const ratio = $derived.by(() => {
		if (aspectRatio && Number.isFinite(aspectRatio) && aspectRatio > 0) return aspectRatio;
		const intrinsic = Number(width) / Number(height);
		return Number.isFinite(intrinsic) && intrinsic > 0 ? intrinsic : 16 / 9;
	});
	const request = $derived({ src, srcset, sizes, crossorigin, referrerpolicy });
	const hasSource = $derived(Boolean(src?.trim() || srcset?.trim()));
	let settled = $state.raw<{ request: typeof request; status: 'loaded' | 'error' } | null>(null);
	const status = $derived(
		!hasSource ? 'error' : settled?.request === request ? settled.status : 'loading'
	);

	function observeImage(element: HTMLImageElement) {
		const currentRequest = request;
		const started = performance.now();
		const minimum = Number.isFinite(minimumLoadingDuration)
			? Math.max(0, minimumLoadingDuration)
			: 0;
		let revealTimer: ReturnType<typeof setTimeout> | undefined;
		if (untrack(() => ref) !== element) ref = element;
		let cancelled = false;

		function settle(status: 'loaded' | 'error') {
			if (!cancelled) settled = { request: currentRequest, status };
		}

		async function loaded() {
			try {
				// Keep the skeleton until the browser can actually paint the image.
				await element.decode();
				if (cancelled) return;
				clearTimeout(revealTimer);
				const remaining = minimum - (performance.now() - started);
				if (remaining > 0) revealTimer = setTimeout(() => settle('loaded'), remaining);
				else settle('loaded');
			} catch {
				failed();
			}
		}

		const failed = () => {
			clearTimeout(revealTimer);
			settle('error');
		};
		element.addEventListener('load', loaded);
		element.addEventListener('error', failed);
		// Cached / server-rendered images can finish before hydration attaches listeners.
		if (element.complete) {
			if (element.naturalWidth > 0) void loaded();
			else failed();
		}

		return () => {
			cancelled = true;
			clearTimeout(revealTimer);
			if (ref === element) ref = null;
			element.removeEventListener('load', loaded);
			element.removeEventListener('error', failed);
		};
	}
</script>

<div
	data-slot="image"
	data-state={status}
	aria-busy={status === 'loading'}
	class={cn('relative isolate block w-full overflow-hidden rounded-md', className)}
	style={`aspect-ratio: ${ratio}; ${style ?? ''}`}
>
	{#if hasSource}
		{#key request}
			<img
				{...restProps}
				{...request}
				{alt}
				{width}
				{height}
				{decoding}
				data-slot="image-content"
				aria-hidden={status === 'error' ? true : restProps['aria-hidden']}
				class={cn('absolute inset-0 size-full object-cover', imageClass)}
				style:opacity={status === 'loaded' ? 1 : 0}
				{@attach observeImage}
			/>
		{/key}
	{/if}
	{#if status === 'loading'}
		<Skeleton aria-hidden="true" class="absolute inset-0 size-full rounded-none" />
	{:else if status === 'error'}
		<span
			data-slot="image-fallback"
			role={alt ? 'img' : undefined}
			aria-label={alt || undefined}
			aria-hidden={alt ? restProps['aria-hidden'] : true}
			class="absolute inset-0 flex items-center justify-center bg-muted p-4 text-center text-sm text-muted-foreground"
		>
			{#if fallback}
				{@render fallback()}
			{:else}
				Image unavailable
			{/if}
		</span>
	{/if}
</div>

<style>
	img {
		transition: opacity var(--motion-state, 175ms) var(--motion-ease-enter, ease-out);
	}

	@media (prefers-reduced-motion: reduce) {
		img {
			transition: none;
		}
	}
</style>
