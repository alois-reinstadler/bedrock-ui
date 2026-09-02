<script lang="ts">
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	const STICK_THRESHOLD = 32;

	let {
		ref = $bindable(null),
		class: className,
		scrollDownLabel = 'Scroll to bottom',
		newMessagesLabel,
		streaming = false,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		scrollDownLabel?: string;
		/** When set, the scroll-down button expands to show this label once new content arrives while scrolled up. */
		newMessagesLabel?: string;
		/** While true the log is marked `aria-busy` so screen readers announce completed messages once. */
		streaming?: boolean;
	} = $props();

	let viewport = $state<HTMLDivElement | null>(null);
	let content = $state<HTMLDivElement | null>(null);
	let stuck = $state(true);
	let hasNewContent = $state(false);

	function distanceFromBottom(element: HTMLDivElement) {
		return element.scrollHeight - element.scrollTop - element.clientHeight;
	}

	function onscroll() {
		if (!viewport) return;
		stuck = distanceFromBottom(viewport) < STICK_THRESHOLD;
		if (stuck) hasNewContent = false;
	}

	function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
		viewport?.scrollTo({ top: viewport.scrollHeight, behavior });
	}

	$effect(() => {
		if (!viewport || !content) return;
		// While the reader sits at the bottom, growing content (new or
		// streaming messages) keeps the view pinned there; once they scroll
		// up, nothing moves under them — the scroll-down button flags the
		// growth instead.
		let lastHeight = content.getBoundingClientRect().height;
		const observer = new ResizeObserver(() => {
			const height = content ? content.getBoundingClientRect().height : lastHeight;
			const grew = height > lastHeight;
			lastHeight = height;
			if (stuck) scrollToBottom('instant');
			else if (grew) hasNewContent = true;
		});
		observer.observe(content);
		scrollToBottom('instant');
		return () => observer.disconnect();
	});

	const showLabel = $derived(Boolean(newMessagesLabel) && hasNewContent);
</script>

<div
	bind:this={ref}
	data-slot="chat-message-list"
	class={cn('relative min-h-0 flex-1', className)}
	{...restProps}
>
	<div bind:this={viewport} {onscroll} class="h-full overflow-y-auto">
		<div
			bind:this={content}
			role="log"
			aria-live="polite"
			aria-busy={streaming || undefined}
			class="flex flex-col gap-3 p-4"
		>
			{@render children?.()}
		</div>
	</div>
	{#if !stuck}
		<button
			type="button"
			aria-label={scrollDownLabel}
			data-new-messages={showLabel ? '' : undefined}
			class={cn(
				'tap-target absolute bottom-3 left-1/2 z-10 inline-flex h-8 -translate-x-1/2 items-center justify-center gap-1.5 rounded-full bg-background text-foreground shadow-md ring-1 ring-foreground/10 motion-state hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
				showLabel ? 'px-3' : 'w-8'
			)}
			onclick={() => {
				hasNewContent = false;
				scrollToBottom();
			}}
		>
			<ArrowDownIcon class="size-4" aria-hidden="true" />
			{#if showLabel}
				<span class="text-xs font-medium whitespace-nowrap">{newMessagesLabel}</span>
			{/if}
		</button>
	{/if}
</div>
