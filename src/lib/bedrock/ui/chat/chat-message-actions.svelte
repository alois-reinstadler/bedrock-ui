<script lang="ts" module>
	const defaultLabels = {
		copy: 'Copy',
		copied: 'Copied',
		retry: 'Retry',
		goodResponse: 'Good response',
		badResponse: 'Bad response',
		edit: 'Edit message',
		copyFailed: 'Copy failed. Try again.'
	};

	export type ChatMessageActionsLabels = Partial<typeof defaultLabels>;
</script>

<script lang="ts">
	// One-off icons: retry/feedback have no semantic registry names, so the
	// lucide components are passed directly as `IconType` (documented one-off).
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import ThumbsDownIcon from '@lucide/svelte/icons/thumbs-down';
	import ThumbsUpIcon from '@lucide/svelte/icons/thumbs-up';
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { onDestroy } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		onCopy,
		onRetry,
		onFeedback,
		onFeedbackChange,
		feedback = $bindable<'up' | 'down' | null>(null),
		onEdit,
		disabled = false,
		labels: labelOverrides = {},
		...restProps
	}: Omit<WithElementRef<HTMLAttributes<HTMLDivElement>>, 'children'> & {
		/** Copy the message; the button shows built-in copied feedback. */
		onCopy?: () => void | Promise<void>;
		onRetry?: () => void;
		onFeedback?: (kind: 'up' | 'down') => void;
		/** Bind the selection to persist it. Clicking the selected thumb clears it. */
		feedback?: 'up' | 'down' | null;
		/** Includes null when feedback is cleared; legacy onFeedback fires only for selections. */
		onFeedbackChange?: (kind: 'up' | 'down' | null) => void;
		onEdit?: () => void;
		disabled?: boolean;
		labels?: ChatMessageActionsLabels;
	} = $props();

	const labels = $derived({ ...defaultLabels, ...labelOverrides });

	let copied = $state(false);
	let copying = $state(false);
	let copyFailed = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	let disposed = false;
	onDestroy(() => {
		disposed = true;
		clearTimeout(copyTimer);
	});

	function choose(kind: 'up' | 'down') {
		if (disabled) return;
		feedback = feedback === kind ? null : kind;
		onFeedbackChange?.(feedback);
		if (feedback) onFeedback?.(feedback);
	}
	async function copy() {
		if (disabled || copying) return;
		copying = true;
		copyFailed = false;
		copied = false;
		try {
			await onCopy?.();
			if (disposed) return;
			copied = true;
			clearTimeout(copyTimer);
			copyTimer = setTimeout(() => (copied = false), 1400);
		} catch {
			if (!disposed) copyFailed = true;
		} finally {
			if (!disposed) copying = false;
		}
	}
</script>

{#if onCopy || onRetry || onFeedback || onFeedbackChange || onEdit}
	<div
		{@attach (node) => {
			ref = node;
			return () => {
				if (ref === node) ref = null;
			};
		}}
		data-slot="chat-message-actions"
		class={cn('flex items-center gap-0.5', className)}
		{...restProps}
	>
		{#if onCopy}
			<IconButton
				icon={copied ? 'checkDouble' : 'copy'}
				label={copied ? labels.copied : labels.copy}
				size="xs"
				disabled={disabled || copying}
				onclick={copy}
			/>
		{/if}
		{#if onEdit}<IconButton
				icon={PencilIcon}
				label={labels.edit}
				size="xs"
				{disabled}
				onclick={onEdit}
			/>{/if}
		{#if onRetry}
			<IconButton
				icon={RefreshCwIcon}
				label={labels.retry}
				size="xs"
				{disabled}
				onclick={() => onRetry()}
			/>
		{/if}
		{#if onFeedback || onFeedbackChange}
			<IconButton
				icon={ThumbsUpIcon}
				label={labels.goodResponse}
				size="xs"
				{disabled}
				aria-pressed={feedback === 'up'}
				class={feedback === 'up' ? 'bg-muted text-foreground' : ''}
				onclick={() => choose('up')}
			/>
			<IconButton
				icon={ThumbsDownIcon}
				label={labels.badResponse}
				size="xs"
				{disabled}
				aria-pressed={feedback === 'down'}
				class={feedback === 'down' ? 'bg-muted text-foreground' : ''}
				onclick={() => choose('down')}
			/>
		{/if}
		{#if copyFailed}<span role="alert" class="text-xs text-destructive">{labels.copyFailed}</span
			>{/if}
	</div>
{/if}
