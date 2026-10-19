<script lang="ts">
	import * as Collapsible from '#lib/bedrock/ui/collapsible';
	import { CodeBlock } from '#lib/bedrock/ui/code-block';
	import { FieldStatus } from '#lib/bedrock/ui/field-status';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { Progress } from '#lib/bedrock/ui/progress';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import {
		chatActivityStatusLabels,
		type ChatActivityStatus,
		type ChatActivityStatusLabels
	} from './activity-types';
	let {
		ref = $bindable(null),
		class: className,
		title,
		status = 'complete',
		kind = 'task',
		target,
		duration,
		detail,
		error,
		progress,
		items = [],
		children,
		open = $bindable(false),
		variant = 'default',
		statusLabels = {},
		...restProps
	}: Omit<WithElementRef<HTMLAttributes<HTMLDivElement>>, 'title' | 'children'> & {
		title: string;
		status?: ChatActivityStatus;
		kind?: 'tool' | 'task' | 'reasoning';
		target?: string;
		duration?: string;
		detail?: string;
		error?: string;
		progress?: number;
		items?: { id: string; label: string; detail?: string }[];
		children?: Snippet;
		open?: boolean;
		variant?: 'default' | 'compact';
		statusLabels?: ChatActivityStatusLabels;
	} = $props();
	const labels = $derived({ ...chatActivityStatusLabels, ...statusLabels });
	const expandable = $derived(!!detail || progress !== undefined || items.length > 0 || !!children);
	const normalizedProgress = $derived(
		progress === undefined
			? undefined
			: Number.isFinite(progress)
				? Math.max(0, Math.min(100, progress))
				: 0
	);
	const compact = $derived(variant === 'compact');
</script>

{#snippet summary()}
	<Icon
		icon={status === 'pending' || status === 'running'
			? 'loading'
			: status === 'error'
				? 'error'
				: 'success'}
		aria-hidden="true"
		class={cn(
			'size-3.5 shrink-0',
			status === 'pending' || status === 'running'
				? 'animate-spin text-muted-foreground motion-reduce:animate-none'
				: status === 'error'
					? 'text-destructive'
					: 'text-green-600 dark:text-green-500'
		)}
	/>
	<span
		class={cn('min-w-0 text-xs font-medium break-words', compact && kind === 'tool' && 'font-code')}
		>{title}</span
	>
	{#if target}<span class="min-w-0 truncate text-xs text-muted-foreground">{target}</span>{/if}
	{#if duration}<span class="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums"
			>{duration}</span
		>{/if}
	<span class={compact ? 'sr-only' : 'ml-auto shrink-0 text-[10px] text-muted-foreground'}
		>{labels[status]}</span
	>
	{#if expandable}<Icon
			icon="chevronDown"
			aria-hidden="true"
			class={cn('ml-auto size-3 shrink-0 text-muted-foreground motion-state', open && 'rotate-180')}
		/>{/if}
{/snippet}

<div
	{@attach (node) => {
		ref = node;
		return () => {
			if (ref === node) ref = null;
		};
	}}
	data-slot="chat-activity-item"
	data-status={status}
	data-kind={kind}
	class={cn('min-w-0', !compact && 'rounded-xl bg-muted/30', className)}
	{...restProps}
>
	{#if expandable}
		<Collapsible.Root {open} onOpenChange={(next) => (open = next)}>
			<Collapsible.Trigger
				class={cn(
					'flex w-full items-center gap-2 rounded-md text-left motion-state hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
					compact ? 'px-2 py-1.5' : 'rounded-xl px-3 py-2.5'
				)}
			>
				{@render summary()}
			</Collapsible.Trigger>
			<Collapsible.Content>
				<div class={cn('space-y-3', !compact && 'px-3 pt-1 pb-3')}>
					{#if normalizedProgress !== undefined}<Progress
							value={normalizedProgress}
							aria-label={title}
						/>{/if}
					{#if detail}<CodeBlock
							code={detail}
							container="section"
							copyButton={false}
							language="plaintext"
							class="border-t border-border/60 bg-muted/30"
						/>{/if}
					{#if items.length}<ul class="space-y-2 border-l border-border pl-3">
							{#each items as item (item.id)}<li
									class="flex flex-wrap justify-between gap-2 text-xs"
								>
									<span>{item.label}</span><span class="text-muted-foreground"
										>{item.detail ?? ''}</span
									>
								</li>{/each}
						</ul>{/if}
					{@render children?.()}
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	{:else}
		<div class={cn('flex w-full items-center gap-2', compact ? 'px-2 py-1.5' : 'px-3 py-2.5')}>
			{@render summary()}
		</div>
	{/if}
	{#if error}<FieldStatus
			status="error"
			message={error}
			hideIcon
			class="px-2 pb-1.5 text-xs"
		/>{/if}
</div>
