<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { Icon } from '#lib/bedrock/ui/icon';
	import * as Collapsible from '#lib/bedrock/ui/collapsible';
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	import FileDiffIcon from '@lucide/svelte/icons/file-diff';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { Button } from '#lib/bedrock/ui/button';
	import { CodeBlock } from '#lib/bedrock/ui/code-block';
	import { createChatAction } from './agent-action.svelte';
	import { chatChangeDiff, type ChatChange } from './agent-types';
	import { cn } from '#lib/utils.js';
	let {
		changes,
		view = 'diff',
		selected = $bindable<string[]>([]),
		onApply,
		disabled = false,
		labels = {},
		class: className
	}: {
		changes: ChatChange[];
		view?: 'diff' | 'before-after';
		selected?: string[];
		onApply: (changes: ChatChange[]) => void | Promise<void>;
		disabled?: boolean;
		labels?: Partial<{
			title: string;
			before: string;
			after: string;
			apply: string;
			applied: string;
			empty: string;
			error: string;
		}>;
		class?: string;
	} = $props();
	const action = createChatAction();
	let applied = $state(false);
	const picked = $derived(changes.filter((change) => selected.includes(change.id)));
	const text = $derived({
		title: 'Review changes',
		before: 'Before',
		after: 'After',
		apply: 'Apply selected changes',
		applied: 'Changes applied',
		empty: 'No changes to review.',
		error: 'Could not apply changes. Your selection is saved. Try again.',
		...labels
	});
	async function apply() {
		if (disabled || !picked.length || applied) return;
		const snapshot = [...picked];
		if (await action.run(() => onApply(snapshot))) applied = true;
	}
</script>

<Card.Root
	role="region"
	data-slot="chat-change-review"
	aria-label={text.title}
	aria-busy={action.pending}
	class={cn('min-w-0 gap-3 bg-background p-4 shadow-sm', className)}
>
	<Card.Title class="flex items-center gap-2 text-sm"
		><Icon icon={FileDiffIcon} class="text-muted-foreground" />{text.title}</Card.Title
	>
	{#each changes as change (change.id)}<Collapsible.Root
			class="group/change min-w-0 overflow-hidden rounded-lg border"
		>
			<Collapsible.Trigger
				class="flex w-full items-center justify-between gap-2 bg-muted/30 p-3 text-left text-xs font-medium break-words outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>{change.title}<Icon
					icon={ChevronDownIcon}
					class="size-3 text-muted-foreground transition-transform group-data-[state=open]/change:rotate-180"
				/></Collapsible.Trigger
			>
			<Collapsible.Content class="space-y-3 p-3">
				<label class="flex items-center gap-2 text-sm"
					><Checkbox
						aria-label={change.title}
						checked={selected.includes(change.id)}
						onCheckedChange={(checked) => {
							selected = checked
								? [...selected.filter((id) => id !== change.id), change.id]
								: selected.filter((id) => id !== change.id);
						}}
						disabled={disabled || action.pending || applied}
					/>{change.title}</label
				>
				{#if view === 'diff'}
					<CodeBlock
						code={chatChangeDiff(change)}
						language="diff"
						title={change.title}
						maxHeight={320}
					/>
				{:else}
					<div class="border-l-2 border-destructive pl-2">
						<CodeBlock
							code={change.before}
							language={change.language}
							title={text.before}
							lineNumbers
							maxHeight={240}
						/>
					</div>
					<div class="border-l-2 border-primary pl-2">
						<CodeBlock
							code={change.after}
							language={change.language}
							title={text.after}
							lineNumbers
							maxHeight={240}
						/>
					</div>
				{/if}
			</Collapsible.Content>
		</Collapsible.Root>{:else}<p class="text-sm text-muted-foreground">{text.empty}</p>{/each}
	{#if !applied}<Button
			data-slot="chat-change-apply"
			class="self-start rounded-full"
			size="sm"
			disabled={disabled || action.pending || !picked.length}
			onclick={apply}>{text.apply} ({picked.length})</Button
		>{/if}
	<p role="status" class="text-xs text-muted-foreground empty:hidden">
		{applied ? text.applied : ''}
	</p>
	{#if action.failed}<p role="alert" class="text-sm text-destructive">{text.error}</p>{/if}
</Card.Root>
