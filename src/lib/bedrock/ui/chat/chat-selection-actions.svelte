<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Button } from '#lib/bedrock/ui/button';
	import { createChatAction } from './agent-action.svelte';
	import type { ChatSelectionAction } from './agent-types';
	import { cn } from '#lib/utils.js';
	let {
		children,
		actions = [
			{ id: 'quote', label: 'Quote' },
			{ id: 'explain', label: 'Explain' },
			{ id: 'rewrite', label: 'Rewrite' }
		],
		onAction,
		disabled = false,
		label = 'Response text',
		hint = 'Select text to use an action.',
		selectLabel = 'Select response text',
		selectedLabel = 'Selected text',
		errorLabel = 'Could not complete this action. Try again.',
		class: className
	}: {
		children: Snippet;
		actions?: ChatSelectionAction[];
		onAction: (action: string, text: string) => void | Promise<void>;
		disabled?: boolean;
		label?: string;
		hint?: string;
		selectLabel?: string;
		selectedLabel?: string;
		errorLabel?: string;
		class?: string;
	} = $props();
	let selected = $state('');
	let content: HTMLElement | undefined;
	const action = createChatAction();
	function observe(node: HTMLElement) {
		content = node;
		const document = node.ownerDocument;
		function read() {
			const selection = document.getSelection();
			if (!selection || selection.isCollapsed || !selection.rangeCount) return;
			const range = selection.getRangeAt(0);
			if (node.contains(range.startContainer) && node.contains(range.endContainer))
				selected = selection.toString().trim();
			else selected = '';
		}
		document.addEventListener('selectionchange', read);
		return () => {
			document.removeEventListener('selectionchange', read);
			if (content === node) content = undefined;
		};
	}
	function selectResponse() {
		if (!content || disabled || action.pending) return;
		const selection = content.ownerDocument.getSelection();
		const range = content.ownerDocument.createRange();
		range.selectNodeContents(content);
		selection?.removeAllRanges();
		selection?.addRange(range);
		selected = content.textContent?.trim() ?? '';
	}
	async function run(id: string) {
		if (disabled || !selected) return;
		const captured = selected;
		await action.run(() => onAction(id, captured));
	}
</script>

<section
	data-slot="chat-selection-actions"
	aria-label={label}
	class={cn('min-w-0 space-y-3', className)}
>
	<div
		{@attach observe}
		data-slot="chat-selectable-content"
		class="text-sm leading-relaxed select-text"
	>
		{@render children()}
	</div>
	<div class="space-y-2 rounded-xl bg-muted/30 p-3">
		{#if selected}<blockquote
				aria-label={selectedLabel}
				class="max-h-24 overflow-auto border-l-2 pl-2 text-sm break-words whitespace-pre-wrap"
			>
				{selected}
			</blockquote>{:else}<p class="text-xs text-muted-foreground">{hint}</p>{/if}
		<div class="flex flex-wrap gap-2">
			<Button
				size="sm"
				class="rounded-full"
				variant="ghost"
				disabled={disabled || action.pending}
				onclick={selectResponse}>{selectLabel}</Button
			>
			{#each actions as item (item.id)}<Button
					size="sm"
					class="rounded-full"
					variant="ghost"
					disabled={disabled || action.pending || !selected}
					onclick={() => run(item.id)}>{item.label}</Button
				>{/each}
		</div>
		{#if action.failed}<p role="alert" class="text-sm text-destructive">{errorLabel}</p>{/if}
	</div>
</section>
