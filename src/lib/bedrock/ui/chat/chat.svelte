<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { onDestroy, type Snippet } from 'svelte';
	import { Button } from '#lib/bedrock/ui/button';
	import { Icon } from '#lib/bedrock/ui/icon';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		isEmpty = false,
		empty,
		state: conversationState = 'ready',
		loading,
		error,
		loadingLabel = 'Loading conversation…',
		errorLabel = 'Could not load this conversation.',
		emptyLabel = 'Start a conversation',
		retryLabel = 'Retry loading conversation',
		onRetry,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		/** The consumer marks the conversation empty; no DOM sniffing. */
		isEmpty?: boolean;
		/** Initial history state. Loading/error take precedence over the empty state. Children remain mounted. */
		state?: 'ready' | 'loading' | 'error';
		loading?: Snippet;
		error?: Snippet;
		loadingLabel?: string;
		errorLabel?: string;
		emptyLabel?: string;
		retryLabel?: string;
		onRetry?: () => void | Promise<void>;
		/** Rendered centered while `isEmpty` — suggestions, a greeting, etc. */
		empty?: Snippet;
	} = $props();
	let retrying = $state(false);
	let disposed = false;
	onDestroy(() => {
		disposed = true;
	});
	async function retry() {
		if (!onRetry || retrying) return;
		retrying = true;
		try {
			await onRetry();
		} catch {
			/* Keep the error and retry control visible. */
		} finally {
			if (!disposed) retrying = false;
		}
	}
</script>

<div
	{@attach (node) => {
		ref = node;
		return () => {
			if (ref === node) ref = null;
		};
	}}
	data-slot="chat"
	class={cn('flex h-full min-h-0 flex-col', className)}
	{...restProps}
>
	{#if conversationState === 'loading'}
		<div
			data-slot="chat-loading"
			role="status"
			class="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-6 text-center text-sm text-muted-foreground"
		>
			{#if loading}{@render loading()}{:else}<Icon
					icon="loading"
					class="size-5 animate-spin motion-reduce:animate-none"
				/>{loadingLabel}{/if}
		</div>
	{:else if conversationState === 'error'}
		<div
			data-slot="chat-error"
			class="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-6 text-center text-sm"
		>
			<div role="alert">
				{#if error}{@render error()}{:else}{errorLabel}{/if}
			</div>
			{#if onRetry}<Button
					type="button"
					variant="outline"
					size="sm"
					disabled={retrying}
					onclick={retry}>{retrying ? loadingLabel : retryLabel}</Button
				>{/if}
		</div>
	{:else if isEmpty}
		<div
			data-slot="chat-empty"
			class="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-6 text-center"
		>
			{#if empty}{@render empty()}{:else}<p class="text-sm text-muted-foreground">
					{emptyLabel}
				</p>{/if}
		</div>
	{/if}
	{@render children?.()}
</div>
