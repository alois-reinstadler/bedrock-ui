<script lang="ts" module>
	export type LightboxItem = {
		src: string;
		alt: string;
		caption?: string;
	};
</script>

<script lang="ts">
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
	import XIcon from '@lucide/svelte/icons/x';
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(false),
		index = $bindable(0),
		items,
		class: className,
		children
	}: {
		open?: boolean;
		index?: number;
		items: LightboxItem[];
		class?: string;
		/** Trigger content; rendered inside a `Dialog.Trigger`. */
		children?: Snippet;
	} = $props();

	const count = $derived(items.length);
	const current = $derived(items[Math.min(Math.max(index, 0), Math.max(count - 1, 0))]);

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
			class="fixed inset-0 isolate z-50 bg-black/80 duration-100 supports-backdrop-filter:backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0"
		/>
		<DialogPrimitive.Content
			data-slot="lightbox-content"
			{onkeydown}
			class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 p-4 duration-150 outline-none md:p-10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
		>
			<DialogPrimitive.Title class="sr-only">
				{current?.alt ?? 'Bildansicht'}
			</DialogPrimitive.Title>
			{#if current}
				{#key current.src}
					<img
						src={current.src}
						alt={current.alt}
						class="max-h-[80dvh] max-w-full rounded-lg object-contain shadow-2xl"
					/>
				{/key}
				<div class="flex items-center gap-3 text-sm text-white/90">
					{#if current.caption}
						<span data-slot="lightbox-caption">{current.caption}</span>
					{/if}
					{#if count > 1}
						<span data-slot="lightbox-counter" class="text-white/60 tabular-nums">
							{index + 1} von {count}
						</span>
					{/if}
				</div>
			{/if}
			{#if count > 1}
				<button
					type="button"
					aria-label="Vorheriges Bild"
					class={cn(navButton, 'absolute top-1/2 left-3 -translate-y-1/2 md:left-6')}
					onclick={previous}
				>
					<ChevronLeftIcon class="size-5" />
				</button>
				<button
					type="button"
					aria-label="Nächstes Bild"
					class={cn(navButton, 'absolute top-1/2 right-3 -translate-y-1/2 md:right-6')}
					onclick={next}
				>
					<ChevronRightIcon class="size-5" />
				</button>
			{/if}
			<DialogPrimitive.Close
				aria-label="Schließen"
				class={cn(navButton, 'absolute top-3 right-3 md:top-6 md:right-6')}
			>
				<XIcon class="size-5" />
			</DialogPrimitive.Close>
		</DialogPrimitive.Content>
	</DialogPrimitive.Portal>
</DialogPrimitive.Root>
