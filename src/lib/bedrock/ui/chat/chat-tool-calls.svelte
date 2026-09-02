<script lang="ts" module>
	export type ChatToolCallStatus = 'pending' | 'running' | 'complete' | 'error';

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
	import { CodeBlock } from '#lib/bedrock/ui/code-block';
	import { FieldStatus } from '#lib/bedrock/ui/field-status';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		calls,
		expanded = $bindable(false),
		labels: labelOverrides = {},
		...restProps
	}: Omit<WithElementRef<HTMLAttributes<HTMLDivElement>>, 'children'> & {
		calls: ChatToolCall[];
		/** Whether the grouped list is expanded (multiple calls only). */
		expanded?: boolean;
		labels?: ChatToolCallsLabels;
	} = $props();

	const labels = $derived({ ...defaultLabels, ...labelOverrides });
	const latest = $derived(calls.at(-1));

	let openDetails = $state<Record<string, boolean>>({});

	function callKey(call: ChatToolCall, index: number): string {
		return call.key ?? String(index);
	}
</script>

{#snippet statusGlyph(status: ChatToolCallStatus | undefined)}
	{#if status === 'pending' || status === 'running'}
		<Icon
			icon="loading"
			aria-hidden="true"
			class="size-3.5 shrink-0 animate-spin text-muted-foreground motion-reduce:animate-none"
		/>
	{:else if status === 'error'}
		<Icon icon="error" aria-hidden="true" class="size-3.5 shrink-0 text-destructive" />
	{:else}
		<Icon
			icon="success"
			aria-hidden="true"
			class="size-3.5 shrink-0 text-green-600 dark:text-green-500"
		/>
	{/if}
{/snippet}

{#snippet rowContent(call: ChatToolCall)}
	{@render statusGlyph(call.status)}
	<span class="font-code text-xs text-foreground">{call.name}</span>
	{#if call.target}
		<span class="min-w-0 truncate text-xs text-muted-foreground">{call.target}</span>
	{/if}
	{#if call.duration}
		<span class="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums">{call.duration}</span>
	{/if}
{/snippet}

{#snippet row(call: ChatToolCall, key: string)}
	<div data-slot="chat-tool-call" data-status={call.status ?? 'complete'} class="flex flex-col">
		{#if call.detail}
			<button
				type="button"
				aria-expanded={openDetails[key] ?? false}
				onclick={() => (openDetails[key] = !openDetails[key])}
				class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left motion-state hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
			>
				{@render rowContent(call)}
			</button>
			{#if openDetails[key]}
				<CodeBlock
					code={call.detail}
					container="section"
					copyButton={false}
					language="plaintext"
					class="border-t border-border/60 bg-muted/30"
				/>
			{/if}
		{:else}
			<div class="flex w-full items-center gap-2 px-2 py-1.5">
				{@render rowContent(call)}
			</div>
		{/if}
		{#if call.error}
			<FieldStatus status="error" message={call.error} hideIcon class="px-2 pb-1.5 text-xs" />
		{/if}
	</div>
{/snippet}

<div
	bind:this={ref}
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
