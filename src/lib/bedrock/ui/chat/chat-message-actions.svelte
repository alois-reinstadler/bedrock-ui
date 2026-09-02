<script lang="ts" module>
	const defaultLabels = {
		copy: 'Copy',
		copied: 'Copied',
		retry: 'Retry',
		goodResponse: 'Good response',
		badResponse: 'Bad response'
	};

	export type ChatMessageActionsLabels = Partial<typeof defaultLabels>;
</script>

<script lang="ts">
	// One-off icons: retry/feedback have no semantic registry names, so the
	// lucide components are passed directly as `IconType` (documented one-off).
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import ThumbsDownIcon from '@lucide/svelte/icons/thumbs-down';
	import ThumbsUpIcon from '@lucide/svelte/icons/thumbs-up';
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		onCopy,
		onRetry,
		onFeedback,
		labels: labelOverrides = {},
		...restProps
	}: Omit<WithElementRef<HTMLAttributes<HTMLDivElement>>, 'children'> & {
		/** Copy the message; the button shows built-in copied feedback. */
		onCopy?: () => void | Promise<void>;
		onRetry?: () => void;
		onFeedback?: (kind: 'up' | 'down') => void;
		labels?: ChatMessageActionsLabels;
	} = $props();

	const labels = $derived({ ...defaultLabels, ...labelOverrides });

	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	$effect(() => () => clearTimeout(copyTimer));

	async function copy() {
		await onCopy?.();
		copied = true;
		clearTimeout(copyTimer);
		copyTimer = setTimeout(() => (copied = false), 1400);
	}
</script>

{#if onCopy || onRetry || onFeedback}
	<div
		bind:this={ref}
		data-slot="chat-message-actions"
		class={cn('flex items-center gap-0.5', className)}
		{...restProps}
	>
		{#if onCopy}
			<IconButton
				icon={copied ? 'checkDouble' : 'copy'}
				label={copied ? labels.copied : labels.copy}
				size="xs"
				onclick={copy}
			/>
		{/if}
		{#if onRetry}
			<IconButton icon={RefreshCwIcon} label={labels.retry} size="xs" onclick={() => onRetry()} />
		{/if}
		{#if onFeedback}
			<IconButton
				icon={ThumbsUpIcon}
				label={labels.goodResponse}
				size="xs"
				onclick={() => onFeedback('up')}
			/>
			<IconButton
				icon={ThumbsDownIcon}
				label={labels.badResponse}
				size="xs"
				onclick={() => onFeedback('down')}
			/>
		{/if}
	</div>
{/if}
