<script lang="ts">
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

<section
	data-slot="chat-approval"
	aria-label={title}
	aria-busy={action.pending}
	class={cn('space-y-3 rounded-xl border bg-background p-4', className)}
>
	<p class="font-medium">{title}</p>
	{#if description}<p class="text-sm text-muted-foreground">{description}</p>{/if}
	{@render children?.()}
	{#if decision === 'pending'}<div class="flex flex-wrap gap-2">
			<Button size="sm" disabled={disabled || action.pending} onclick={() => decide('approved')}
				>{text.approve}</Button
			>
			<Button
				size="sm"
				variant="outline"
				disabled={disabled || action.pending}
				onclick={() => decide('rejected')}>{text.reject}</Button
			>
		</div>{/if}
	<p role="status" class="text-sm text-muted-foreground">
		{action.pending ? text.working : decision === 'pending' ? '' : text[decision]}
	</p>
	{#if action.failed}<p role="alert" class="text-sm text-destructive">{text.error}</p>{/if}
</section>
