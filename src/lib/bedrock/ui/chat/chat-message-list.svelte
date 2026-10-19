<script lang="ts">
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { onDestroy, tick } from 'svelte';
	import { Button } from '#lib/bedrock/ui/button';
	import type { HTMLAttributes } from 'svelte/elements';

	const STICK_THRESHOLD = 32;
	const policy = useMotionPolicy();

	let {
		ref = $bindable(null),
		class: className,
		scrollDownLabel = 'Scroll to bottom',
		newMessagesLabel,
		streaming = false,
		hasMore = false,
		onLoadMore,
		loadMoreLabel = 'Load older messages',
		loadingMoreLabel = 'Loading older messages…',
		loadErrorLabel = 'Could not load older messages. Try again.',
		historyStartLabel = 'Beginning of conversation',

		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		scrollDownLabel?: string;
		/** When set, the scroll-down button expands to show this label once new content arrives while scrolled up. */
		newMessagesLabel?: string;
		/** While true the log is marked `aria-busy` so screen readers announce completed messages once. */
		streaming?: boolean;
		hasMore?: boolean;
		/** Prepend keyed messages before resolving. Rejection keeps the existing history and enables retry. */
		onLoadMore?: () => void | Promise<void>;
		loadMoreLabel?: string;
		loadingMoreLabel?: string;
		loadErrorLabel?: string;
		historyStartLabel?: string;
	} = $props();

	let viewport: HTMLDivElement | null = null;
	let content: HTMLDivElement | null = null;
	let stuck = $state(true);
	let loadingMore = $state(false);
	let loadError = $state(false);
	let disposed = false;
	let lastHeight = 0;
	let scrollingToBottom = false;
	onDestroy(() => {
		disposed = true;
	});
	async function loadMore() {
		if (!hasMore || !onLoadMore || loadingMore || !viewport || !content) return;
		const view = viewport;
		const anchor = [...content.children].find(
			(child) => child.getBoundingClientRect().bottom > view.getBoundingClientRect().top
		);
		const top = (anchor?.getBoundingClientRect().top ?? 0) - view.getBoundingClientRect().top;
		const previousHeight = view.scrollHeight;
		const previousScroll = view.scrollTop;
		loadingMore = true;
		loadError = false;
		try {
			await onLoadMore();
		} catch {
			if (!disposed) loadError = true;
		} finally {
			if (!disposed) {
				await tick();
				if (!disposed) {
					view.scrollTop += anchor?.isConnected
						? anchor.getBoundingClientRect().top - view.getBoundingClientRect().top - top
						: view.scrollHeight - previousHeight + previousScroll - view.scrollTop;
					lastHeight = content?.getBoundingClientRect().height ?? 0;
					loadingMore = false;
					onscroll();
				}
			}
		}
	}
	let hasNewContent = $state(false);

	function distanceFromBottom(element: HTMLDivElement) {
		return element.scrollHeight - element.scrollTop - element.clientHeight;
	}

	function onscroll() {
		if (!viewport || loadingMore) return;
		const distance = distanceFromBottom(viewport);
		stuck = distance < STICK_THRESHOLD;
		if (distance <= 1) scrollingToBottom = false;
		if (stuck) hasNewContent = false;
	}

	function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
		if (!viewport) return;
		const resolvedBehavior = policy.reduced ? 'instant' : behavior;
		scrollingToBottom = resolvedBehavior === 'smooth' && distanceFromBottom(viewport) > 1;
		viewport.scrollTo({ top: viewport.scrollHeight, behavior: resolvedBehavior });
	}

	function observeContent(node: HTMLDivElement) {
		content = node;
		lastHeight = node.getBoundingClientRect().height;
		const observer = new ResizeObserver(() => {
			const height = node.getBoundingClientRect().height;
			const grew = height > lastHeight;
			lastHeight = height;
			if (loadingMore) return;
			if (stuck) scrollToBottom('instant');
			else if (grew) hasNewContent = true;
		});
		observer.observe(node);
		void tick().then(() => {
			if (!disposed) scrollToBottom('instant');
		});
		return () => {
			observer.disconnect();
			content = null;
		};
	}

	const showLabel = $derived(Boolean(newMessagesLabel) && hasNewContent);
</script>

<div
	{@attach (node) => {
		ref = node;
		return () => {
			if (ref === node) ref = null;
		};
	}}
	data-slot="chat-message-list"
	class={cn('relative flex min-h-0 flex-1 flex-col', className)}
	{...restProps}
>
	{#if onLoadMore}
		<div data-slot="chat-history-controls" class="shrink-0 px-3 pt-2 text-center">
			{#if hasMore}<Button
					type="button"
					variant="ghost"
					size="sm"
					disabled={loadingMore}
					onclick={loadMore}>{loadingMore ? loadingMoreLabel : loadMoreLabel}</Button
				>
			{:else}<p class="py-2 text-xs text-muted-foreground">{historyStartLabel}</p>{/if}
			{#if loadError}<p role="alert" class="text-xs text-destructive">{loadErrorLabel}</p>{/if}
		</div>
	{/if}
	<div
		{@attach (node) => {
			viewport = node;
			const cancelPending = () => {
				scrollingToBottom = false;
			};
			const cancelOnKey = (event: KeyboardEvent) => {
				if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key))
					cancelPending();
			};
			node.addEventListener('wheel', cancelPending, { passive: true });
			node.addEventListener('touchstart', cancelPending, { passive: true });
			node.addEventListener('keydown', cancelOnKey);
			node.addEventListener('scrollend', cancelPending);
			return () => {
				node.removeEventListener('wheel', cancelPending);
				node.removeEventListener('touchstart', cancelPending);
				node.removeEventListener('keydown', cancelOnKey);
				node.removeEventListener('scrollend', cancelPending);
				viewport = null;
			};
		}}
		data-slot="chat-message-viewport"
		{@attach (node) => {
			if (policy.reduced && scrollingToBottom) {
				scrollingToBottom = false;
				node.scrollTo({ top: node.scrollHeight, behavior: 'instant' });
			}
		}}
		{onscroll}
		class="min-h-0 flex-1 overflow-y-auto [overflow-anchor:none]"
	>
		<div
			{@attach observeContent}
			role="log"
			aria-live="polite"
			aria-busy={streaming || loadingMore || undefined}
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
