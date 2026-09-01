<script lang="ts">
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import { Button } from '#lib/bedrock/ui/button';
	import TextareaPrimitive from '#lib/shadcn/ui/textarea/textarea.svelte';
	import { cn } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		value = $bindable(''),
		class: className,
		placeholder = 'Nachricht schreiben…',
		disabled = false,
		onSend,
		actions,
		...restProps
	}: Omit<HTMLAttributes<HTMLFormElement>, 'onsubmit'> & {
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		/** Called with the trimmed message; the composer clears afterwards. */
		onSend?: (message: string) => void;
		/** Extra controls rendered left of the send button (attachments etc.). */
		actions?: Snippet;
	} = $props();

	let textarea = $state<HTMLTextAreaElement | null>(null);

	function submit() {
		const message = value.trim();
		if (!message || disabled) return;
		onSend?.(message);
		value = '';
		textarea?.focus();
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
			event.preventDefault();
			submit();
		}
	}
</script>

<form
	data-slot="chat-composer"
	class={cn(
		'flex items-end gap-2 rounded-xl border border-input bg-background p-2 shadow-xs motion-state focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
		className
	)}
	onsubmit={(event) => {
		event.preventDefault();
		submit();
	}}
	{...restProps}
>
	<TextareaPrimitive
		bind:ref={textarea}
		bind:value
		{placeholder}
		{disabled}
		{onkeydown}
		rows={1}
		aria-label={placeholder}
		class="[field-sizing:content] max-h-40 min-h-8 flex-1 resize-none border-0 bg-transparent px-2 py-1.5 text-sm shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
	/>
	{@render actions?.()}
	<Button
		type="submit"
		size="icon-sm"
		aria-label="Senden"
		disabled={disabled || value.trim().length === 0}
		data-slot="chat-send-button"
		class="tap-target shrink-0 rounded-full motion-press motion-state"
	>
		<ArrowUpIcon class="size-4" />
	</Button>
</form>
