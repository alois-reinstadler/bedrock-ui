<script lang="ts" module>
	const defaultLabels = {
		copy: 'Copy',
		copied: 'Copied',
		retry: 'Retry',
		goodResponse: 'Good response',
		badResponse: 'Bad response',
		edit: 'Edit message',
		copyFailed: 'Copy failed. Try again.',
		retryFailed: 'Retry failed. Try again.',
		feedbackFailed: 'Could not save feedback. Try again.'
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
	import { createChatAction } from './agent-action.svelte';
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
		onRetry?: (() => void) | (() => Promise<void>);
		onFeedback?: ((kind: 'up' | 'down') => void) | ((kind: 'up' | 'down') => Promise<void>);
		/** Bind the selection to persist it. Clicking the selected thumb clears it. */
		feedback?: 'up' | 'down' | null;
		/** Includes null when feedback is cleared; legacy onFeedback fires only for selections. */
		onFeedbackChange?:
			((kind: 'up' | 'down' | null) => void) | ((kind: 'up' | 'down' | null) => Promise<void>);
		onEdit?: () => void;
		disabled?: boolean;
		labels?: ChatMessageActionsLabels;
	} = $props();

	const labels = $derived({ ...defaultLabels, ...labelOverrides });

	let copied = $state(false);
	const copyAction = createChatAction();
	const retryAction = createChatAction();
	const feedbackAction = createChatAction();
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	onDestroy(() => {
		clearTimeout(copyTimer);
	});

	async function choose(kind: 'up' | 'down') {
		if (disabled || feedbackAction.pending) return;
		const next = feedback === kind ? null : kind;
		if (
			await feedbackAction.run(async () => {
				await onFeedbackChange?.(next);
				if (next) await onFeedback?.(next);
			})
		)
			feedback = next;
	}
	async function retry() {
		if (disabled || !onRetry) return;
		await retryAction.run(onRetry);
	}
	async function copy() {
		if (disabled || copyAction.pending || !onCopy) return;
		copied = false;
		clearTimeout(copyTimer);
		if (await copyAction.run(onCopy)) {
			copied = true;
			copyTimer = setTimeout(() => (copied = false), 1400);
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
				disabled={disabled || copyAction.pending}
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
				disabled={disabled || retryAction.pending}
				onclick={retry}
			/>
		{/if}
		{#if onFeedback || onFeedbackChange}
			<IconButton
				icon={ThumbsUpIcon}
				label={labels.goodResponse}
				size="xs"
				disabled={disabled || feedbackAction.pending}
				aria-pressed={feedback === 'up'}
				class={feedback === 'up' ? 'bg-muted text-foreground' : ''}
				onclick={() => choose('up')}
			/>
			<IconButton
				icon={ThumbsDownIcon}
				label={labels.badResponse}
				size="xs"
				disabled={disabled || feedbackAction.pending}
				aria-pressed={feedback === 'down'}
				class={feedback === 'down' ? 'bg-muted text-foreground' : ''}
				onclick={() => choose('down')}
			/>
		{/if}
		{#if copyAction.failed}<span role="alert" class="text-xs text-destructive"
				>{labels.copyFailed}</span
			>{/if}
		{#if retryAction.failed}<span role="alert" class="text-xs text-destructive"
				>{labels.retryFailed}</span
			>{/if}
		{#if feedbackAction.failed}<span role="alert" class="text-xs text-destructive"
				>{labels.feedbackFailed}</span
			>{/if}
	</div>
{/if}
