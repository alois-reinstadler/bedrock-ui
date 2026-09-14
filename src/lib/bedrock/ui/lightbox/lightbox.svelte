<script lang="ts" module>
	export type LightboxItem = {
		src: string;
		alt: string;
		caption?: string;
		/** Defaults to `pdf` when `src` ends in ".pdf", otherwise `image`. */
		type?: 'image' | 'pdf';
		/** Filename suggested when downloading; derived from src/alt otherwise. */
		downloadName?: string;
	};

	const defaultLabels = {
		download: 'Download',
		close: 'Close',
		previous: 'Previous image',
		next: 'Next image',
		counter: (current: number, total: number) => `${current} of ${total}`,
		imageView: 'Image view',
		fileFallbackName: 'file'
	};

	export type LightboxLabels = Partial<typeof defaultLabels>;
</script>

<script lang="ts">
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import XIcon from '@lucide/svelte/icons/x';
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { Motion } from '#lib/bedrock/motion/css.js';
	import { PdfViewer } from '#lib/bedrock/ui/pdf-viewer';
	import { cn } from '#lib/utils.js';
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(false),
		index = $bindable(0),
		items,
		class: className,
		labels: labelOverrides = {},
		children
	}: {
		open?: boolean;
		index?: number;
		items: LightboxItem[];
		class?: string;
		/** Overrides for the built-in UI strings. */
		labels?: LightboxLabels;
		/** Trigger content; rendered inside a `Dialog.Trigger`. */
		children?: Snippet;
	} = $props();

	const l = $derived({ ...defaultLabels, ...labelOverrides });

	const count = $derived(items.length);
	const current = $derived(items[Math.min(Math.max(index, 0), Math.max(count - 1, 0))]);
	const kind = $derived(
		current?.type ?? (current?.src.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image')
	);

	function suggestedName(item: LightboxItem): string {
		if (item.downloadName) return item.downloadName;
		if (item.src.startsWith('data:')) {
			const mime = item.src.slice(5, item.src.indexOf(item.src.includes(';') ? ';' : ','));
			const extension = mime.includes('svg') ? 'svg' : (mime.split('/')[1] ?? 'bin');
			return `${item.alt.replaceAll(/[^\w-]+/g, '-').toLowerCase() || l.fileFallbackName}.${extension}`;
		}
		return item.src.split('/').pop()?.split('?')[0] || item.alt;
	}

	function downloadCurrent() {
		if (!current) return;
		const anchor = document.createElement('a');
		anchor.href = current.src;
		anchor.download = suggestedName(current);
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
	}

	function onContentClick(event: MouseEvent) {
		// Clicks on the empty stage (outside image/PDF and controls) dismiss.
		if (event.target === event.currentTarget) open = false;
	}

	function previous() {
		if (count === 0) return;
		index = (index - 1 + count) % count;
	}

	function next() {
		if (count === 0) return;
		index = (index + 1) % count;
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			previous();
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			next();
		}
	}

	const navButton = cn(
		'tap-target inline-flex size-9 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm ring-1 ring-foreground/10 backdrop-blur-sm hover:bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
	);
</script>

<DialogPrimitive.Root bind:open>
	{#if children}
		<DialogPrimitive.Trigger data-slot="lightbox-trigger" class={cn(className)}>
			{@render children()}
		</DialogPrimitive.Trigger>
	{/if}
	<DialogPrimitive.Portal>
		<DialogPrimitive.Overlay
			data-slot="lightbox-overlay"
			class="fixed inset-0 isolate z-50 bg-black/80 motion-overlay supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
		/>
		<DialogPrimitive.Content
			data-slot="lightbox-content"
			{onkeydown}
			onclick={onContentClick}
			class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 p-4 motion-overlay outline-none md:p-10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
		>
			<DialogPrimitive.Title class="sr-only">
				{current?.alt ?? l.imageView}
			</DialogPrimitive.Title>
			{#if current}
				{#key current.src}
					<Motion
						motion={{
							initial: { opacity: 0 },
							animate: { opacity: 1 },
							transition: { duration: 0.18 }
						}}
					>
						<div
							data-slot="lightbox-stage"
							class="flex h-[80dvh] w-[min(92vw,56rem)] items-center justify-center"
						>
							{#if kind === 'pdf'}
								<PdfViewer
									src={current.src}
									aria-label={current.alt}
									class="h-full w-full rounded-lg shadow-2xl"
								/>
							{:else}
								<img
									src={current.src}
									alt={current.alt}
									class="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
								/>
							{/if}
						</div>
					</Motion>
				{/key}
				<div class="flex items-center gap-3 text-sm text-white/90">
					{#if current.caption}
						<span data-slot="lightbox-caption">{current.caption}</span>
					{/if}
					{#if count > 1}
						<span data-slot="lightbox-counter" class="text-white/60 tabular-nums">
							{l.counter(index + 1, count)}
						</span>
					{/if}
				</div>
			{/if}
			{#if count > 1}
				<button
					type="button"
					aria-label={l.previous}
					class={cn(navButton, 'absolute top-1/2 left-3 -translate-y-1/2 md:left-6')}
					onclick={previous}
				>
					<ChevronLeftIcon class="size-5" />
				</button>
				<button
					type="button"
					aria-label={l.next}
					class={cn(navButton, 'absolute top-1/2 right-3 -translate-y-1/2 md:right-6')}
					onclick={next}
				>
					<ChevronRightIcon class="size-5" />
				</button>
			{/if}
			<div class="absolute top-3 right-3 flex items-center gap-2 md:top-6 md:right-6">
				<button type="button" aria-label={l.download} class={navButton} onclick={downloadCurrent}>
					<DownloadIcon class="size-5" />
				</button>
				<DialogPrimitive.Close aria-label={l.close} class={navButton}>
					<XIcon class="size-5" />
				</DialogPrimitive.Close>
			</div>
		</DialogPrimitive.Content>
	</DialogPrimitive.Portal>
</DialogPrimitive.Root>
