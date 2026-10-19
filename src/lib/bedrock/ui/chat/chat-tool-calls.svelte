<script lang="ts" module>
	import type { ChatActivityStatus, ChatActivityStatusLabels } from './activity-types';
	export type ChatToolCallStatus = ChatActivityStatus;

	export type ChatToolCall = {
		name: string;
		status?: ChatToolCallStatus;
		/** What the tool ran against — a file, query, URL… */
		target?: string;
		/** Preformatted duration, e.g. "1.2s". */
		duration?: string;
		/** Raw payload/result revealed by clicking the row. */
		detail?: string;
		error?: string;
		/** Stable identity for streaming additions; falls back to the list index. */
		key?: string;
	};

	const defaultLabels = {
		toolCalls: (count: number) => `${count} tool calls`
	};

	export type ChatToolCallsLabels = Partial<typeof defaultLabels>;
</script>

<script lang="ts">
	import * as Collapsible from '#lib/bedrock/ui/collapsible';
	import ActivityItem from './chat-activity-item.svelte';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		calls,
		expanded = $bindable(false),
		labels: labelOverrides = {},
		statusLabels = {},
		...restProps
	}: Omit<WithElementRef<HTMLAttributes<HTMLDivElement>>, 'children'> & {
		calls: ChatToolCall[];
		/** Whether the grouped list is expanded (multiple calls only). */
		expanded?: boolean;
		labels?: ChatToolCallsLabels;
		statusLabels?: ChatActivityStatusLabels;
	} = $props();

	const labels = $derived({ ...defaultLabels, ...labelOverrides });
	const latest = $derived(calls.at(-1));

	let openDetails = $state<Record<string, boolean>>({});

	function callKey(call: ChatToolCall, index: number): string {
		return call.key ?? String(index);
	}
</script>

{#snippet row(call: ChatToolCall, key: string)}
	<ActivityItem
		bind:open={() => openDetails[key] ?? false, (next) => (openDetails[key] = next)}
		data-slot="chat-tool-call"
		title={call.name}
		status={call.status}
		kind="tool"
		target={call.target}
		duration={call.duration}
		detail={call.detail}
		error={call.error}
		variant="compact"
		{statusLabels}
	/>
{/snippet}

<div
	{@attach (node) => {
		ref = node;
		return () => {
			if (ref === node) ref = null;
		};
	}}
	data-slot="chat-tool-calls"
	class={cn('overflow-hidden rounded-lg border border-border/60 bg-muted/20', className)}
	{...restProps}
>
	{#if calls.length <= 1}
		{#each calls as call, index (callKey(call, index))}
			{@render row(call, callKey(call, index))}
		{/each}
	{:else}
		<Collapsible.Root open={expanded} onOpenChange={(value) => (expanded = value)}>
			<Collapsible.Trigger
				data-slot="chat-tool-calls-trigger"
				class="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs text-muted-foreground motion-state hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
			>
				<Icon icon="wrench" aria-hidden="true" class="size-3.5 shrink-0" />
				<span class="font-medium">{labels.toolCalls(calls.length)}</span>
				{#if latest}
					<span class="min-w-0 truncate font-code">{latest.name}</span>
				{/if}
				<Icon
					icon="chevronDown"
					aria-hidden="true"
					class={cn('ml-auto size-3.5 shrink-0 motion-state', expanded && 'rotate-180')}
				/>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<div class="flex flex-col border-t border-border/60">
					{#each calls as call, index (callKey(call, index))}
						{@render row(call, callKey(call, index))}
					{/each}
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	{/if}
</div>
