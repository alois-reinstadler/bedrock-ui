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
	import { onDestroy } from 'svelte';
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
	let pending = $state(false);
	let retryError = $state(false);
	let disposed = false;
	onDestroy(() => {
		disposed = true;
	});
	const recoverable = $derived(status === 'failed' || status === 'interrupted');
	async function retry() {
		if (disabled || pending || !onRetry) return;
		pending = true;
		retryError = false;
		try {
			await onRetry();
		} catch {
			if (!disposed) retryError = true;
		} finally {
			if (!disposed) pending = false;
		}
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
		tone={pending
			? 'info'
			: status === 'failed'
				? 'error'
				: status === 'interrupted'
					? 'warning'
					: status === 'sent'
						? 'success'
						: 'info'}
		busy={pending || ['sending', 'waiting', 'streaming'].includes(status)}
		message={pending ? labels.retrying : (detail ?? labels[status])}
	/>
	{#if recoverable && onRetry}<Button
			type="button"
			size="sm"
			variant="ghost"
			disabled={disabled || pending}
			onclick={retry}>{labels.retry}</Button
		>{/if}
	{#if retryError && recoverable}<Feedback tone="error" message={labels.retryFailed} />{/if}
</div>
