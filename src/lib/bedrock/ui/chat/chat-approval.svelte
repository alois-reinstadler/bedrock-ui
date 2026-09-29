<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { Icon } from '#lib/bedrock/ui/icon';
	import ShieldCheckIcon from '@lucide/svelte/icons/shield-check';
	import { Button } from '#lib/bedrock/ui/button';
	import { createChatAction } from './agent-action.svelte';
	import type { Snippet } from 'svelte';
	import { cn } from '#lib/utils.js';
	let {
		title,
		description,
		children,
		decision = $bindable<'pending' | 'approved' | 'rejected'>('pending'),
		onDecide,
		disabled = false,
		labels = {},
		class: className
	}: {
		title: string;
		description?: string;
		children?: Snippet;
		decision?: 'pending' | 'approved' | 'rejected';
		onDecide: (decision: 'approved' | 'rejected') => void | Promise<void>;
		disabled?: boolean;
		labels?: Partial<{
			approve: string;
			reject: string;
			approved: string;
			rejected: string;
			working: string;
			error: string;
		}>;
		class?: string;
	} = $props();
	const action = createChatAction();
	const text = $derived({
		approve: 'Approve',
		reject: 'Reject',
		approved: 'Approved',
		rejected: 'Rejected',
		working: 'Saving decision…',
		error: 'Could not save your decision. Try again.',
		...labels
	});
	async function decide(next: 'approved' | 'rejected') {
		if (disabled || decision !== 'pending') return;
		if (await action.run(() => onDecide(next))) decision = next;
	}
</script>

<Card.Root
	data-slot="chat-approval"
	role="region"
	aria-label={title}
	aria-busy={action.pending}
	class={cn('min-w-0 gap-0 bg-background py-0 shadow-sm', className)}
>
	<Card.Header class="flex items-start gap-3 p-4">
		<span
			class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
			><Icon icon={ShieldCheckIcon} /></span
		>
		<div class="min-w-0 space-y-1">
			<Card.Title class="text-sm leading-6">{title}</Card.Title>
			{#if description}<Card.Description class="text-xs leading-relaxed"
					>{description}</Card.Description
				>{/if}
		</div>
	</Card.Header>
	{#if children}<Card.Content class="px-4 pb-4">{@render children()}</Card.Content>{/if}
	<Card.Footer class="flex-wrap gap-2 px-4 py-3">
		{#if decision === 'pending'}
			<Button
				size="sm"
				class="rounded-full"
				disabled={disabled || action.pending}
				onclick={() => decide('approved')}>{text.approve}</Button
			>
			<Button
				size="sm"
				variant="ghost"
				class="rounded-full"
				disabled={disabled || action.pending}
				onclick={() => decide('rejected')}>{text.reject}</Button
			>
		{/if}
		<p role="status" class="text-xs text-muted-foreground empty:hidden">
			{action.pending ? text.working : decision === 'pending' ? '' : text[decision]}
		</p>
	</Card.Footer>
	{#if action.failed}<p role="alert" class="px-4 pb-3 text-xs text-destructive">
			{text.error}
		</p>{/if}
</Card.Root>
