<script lang="ts">
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
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
		'flex items-end gap-2 rounded-xl border border-input bg-background p-2 shadow-xs transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
		className
	)}
	onsubmit={(event) => {
		event.preventDefault();
		submit();
	}}
	{...restProps}
>
	<textarea
		bind:this={textarea}
		bind:value
		{placeholder}
		{disabled}
		{onkeydown}
		rows={1}
		aria-label={placeholder}
		class="[field-sizing:content] max-h-40 min-h-8 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
	></textarea>
	{@render actions?.()}
	<button
		type="submit"
		aria-label="Senden"
		disabled={disabled || value.trim().length === 0}
		data-slot="chat-send-button"
		class="tap-target inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40"
	>
		<ArrowUpIcon class="size-4" />
	</button>
</form>
