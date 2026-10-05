<script lang="ts" module>
	export type ChatMessageStatus =
		'sending' | 'waiting' | 'streaming' | 'sent' | 'failed' | 'interrupted';
	const defaults = {
		sending: 'Sending…',
		waiting: 'Waiting for a response…',
		streaming: 'Receiving response…',
		sent: 'Sent',
		failed: 'Message failed.',
		interrupted: 'Response interrupted.',
		retry: 'Retry message',
		retrying: 'Retrying…',
		retryFailed: 'Retry failed. Try again.'
	};
	export type ChatMessageStatusLabels = Partial<typeof defaults>;
</script>

<script lang="ts">
	import { createChatAction } from './agent-action.svelte';
	import { Button } from '#lib/bedrock/ui/button';
	import Feedback from './chat-feedback.svelte';
	import { cn } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	let {
		status,
		detail,
		onRetry,
		disabled = false,
		labels: overrides,
		class: className,
		...rest
	}: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
		status: ChatMessageStatus;
		detail?: string;
		onRetry?: () => void | Promise<void>;
		disabled?: boolean;
		labels?: ChatMessageStatusLabels;
	} = $props();
	const labels = $derived({ ...defaults, ...overrides });
	const action = createChatAction();
	const recoverable = $derived(status === 'failed' || status === 'interrupted');
	async function retry() {
		if (disabled || !onRetry) return;
		await action.run(onRetry);
	}
</script>

<div
	{...rest}
	data-slot="chat-message-status"
	data-status={status}
	class={cn('flex flex-wrap items-center gap-2 text-xs text-muted-foreground', className)}
>
	<Feedback
		role="status"
		tone={action.pending
			? 'info'
			: status === 'failed'
				? 'error'
				: status === 'interrupted'
					? 'warning'
					: status === 'sent'
						? 'success'
						: 'info'}
		busy={action.pending || ['sending', 'waiting', 'streaming'].includes(status)}
		message={action.pending ? labels.retrying : (detail ?? labels[status])}
	/>
	{#if recoverable && onRetry}<Button
			type="button"
			size="sm"
			variant="ghost"
			disabled={disabled || action.pending}
			onclick={retry}>{labels.retry}</Button
		>{/if}
	{#if action.failed && recoverable}<Feedback tone="error" message={labels.retryFailed} />{/if}
</div>
