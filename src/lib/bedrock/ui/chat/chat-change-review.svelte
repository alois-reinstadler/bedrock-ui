<script lang="ts">
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

<section
	data-slot="chat-change-review"
	aria-label={text.title}
	aria-busy={action.pending}
	class={cn('min-w-0 space-y-3 rounded-xl border bg-background p-4', className)}
>
	<p class="font-medium">{text.title}</p>
	{#each changes as change (change.id)}<details class="min-w-0 rounded-lg border">
			<summary
				class="cursor-pointer p-3 text-sm font-medium break-words focus-visible:outline-2 focus-visible:outline-ring"
				>{change.title}</summary
			>
			<div class="space-y-3 px-3 pb-3">
				<label class="flex items-center gap-2 text-sm"
					><input
						type="checkbox"
						value={change.id}
						bind:group={selected}
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
			</div>
		</details>{:else}<p class="text-sm text-muted-foreground">{text.empty}</p>{/each}
	{#if !applied}<Button
			size="sm"
			disabled={disabled || action.pending || !picked.length}
			onclick={apply}>{text.apply} ({picked.length})</Button
		>{/if}
	<p role="status" class="text-sm text-muted-foreground">{applied ? text.applied : ''}</p>
	{#if action.failed}<p role="alert" class="text-sm text-destructive">{text.error}</p>{/if}
</section>
