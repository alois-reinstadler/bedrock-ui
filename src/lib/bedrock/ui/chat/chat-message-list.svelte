<script lang="ts">
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	const STICK_THRESHOLD = 32;

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	let viewport = $state<HTMLDivElement | null>(null);
	let content = $state<HTMLDivElement | null>(null);
	let stuck = $state(true);

	function distanceFromBottom(element: HTMLDivElement) {
		return element.scrollHeight - element.scrollTop - element.clientHeight;
	}

	function onscroll() {
		if (!viewport) return;
		stuck = distanceFromBottom(viewport) < STICK_THRESHOLD;
	}

	function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
		viewport?.scrollTo({ top: viewport.scrollHeight, behavior });
	}

	$effect(() => {
		if (!viewport || !content) return;
		// While the reader sits at the bottom, growing content (new or
		// streaming messages) keeps the view pinned there; once they scroll
		// up, nothing moves under them.
		const observer = new ResizeObserver(() => {
			if (stuck) scrollToBottom('instant');
		});
		observer.observe(content);
		scrollToBottom('instant');
		return () => observer.disconnect();
	});
</script>

<div
	bind:this={ref}
	data-slot="chat-message-list"
	class={cn('relative min-h-0 flex-1', className)}
	{...restProps}
>
	<div bind:this={viewport} {onscroll} class="h-full overflow-y-auto">
		<div bind:this={content} class="flex flex-col gap-3 p-4">
			{@render children?.()}
		</div>
	</div>
	{#if !stuck}
		<button
			type="button"
			aria-label="Nach unten scrollen"
			class="tap-target absolute bottom-3 left-1/2 z-10 inline-flex size-8 -translate-x-1/2 items-center justify-center rounded-full bg-background text-foreground shadow-md ring-1 ring-foreground/10 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
			onclick={() => scrollToBottom()}
		>
			<ArrowDownIcon class="size-4" />
		</button>
	{/if}
</div>
