<script lang="ts">
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import { Swap } from '#lib/bedrock/motion/index.js';
	import { Button } from '#lib/bedrock/ui/button';
	import { Icon } from '#lib/bedrock/ui/icon';
	import TextareaPrimitive from '#lib/shadcn/ui/textarea/textarea.svelte';
	import { cn } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		value = $bindable(''),
		class: className,
		placeholder = 'Write a message…',
		disabled = false,
		busy = false,
		sendLabel = 'Send',
		stopLabel = 'Stop',
		maxRows = 8,
		onSend,
		onStop,
		onFiles,
		actions,
		headerActions,
		drawer,
		...restProps
	}: Omit<HTMLAttributes<HTMLFormElement>, 'onsubmit'> & {
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		/** While true the send button swaps to a stop button; typing stays enabled. */
		busy?: boolean;
		/** Accessible label for the send button. */
		sendLabel?: string;
		/** Accessible label for the stop button shown while `busy`. */
		stopLabel?: string;
		/** Caps how tall the textarea grows before it scrolls. */
		maxRows?: number;
		/** Called with the trimmed message; the composer clears afterwards. */
		onSend?: (message: string) => void;
		/** Called when the stop button is pressed while `busy`. */
		onStop?: () => void;
		/** Called with files pasted into or dropped onto the composer. */
		onFiles?: (files: File[]) => void;
		/** Extra controls rendered left of the send button (attachments etc.). */
		actions?: Snippet;
		/** Row rendered above the textarea, aligned left (model picker etc.). */
		headerActions?: Snippet;
		/** Full-width row above everything inside the form — attachment chips etc. */
		drawer?: Snippet;
	} = $props();

	const uid = $props.id();
	let textarea = $state<HTMLTextAreaElement | null>(null);

	// text-sm line height is 1.25rem; py-1.5 adds 0.75rem vertical padding.
	const maxHeight = $derived(`${maxRows * 1.25 + 0.75}rem`);

	function submit() {
		const message = value.trim();
		if (!message || disabled || busy) return;
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

	function onpaste(event: ClipboardEvent) {
		if (!onFiles) return;
		const files = [...(event.clipboardData?.files ?? [])];
		if (files.length === 0) return;
		event.preventDefault();
		onFiles(files);
	}

	function ondragover(event: DragEvent) {
		if (onFiles && event.dataTransfer?.types.includes('Files')) event.preventDefault();
	}

	function ondrop(event: DragEvent) {
		if (!onFiles) return;
		const files = [...(event.dataTransfer?.files ?? [])];
		if (files.length === 0) return;
		event.preventDefault();
		onFiles(files);
	}
</script>

<form
	data-slot="chat-composer"
	class={cn(
		'flex flex-col gap-2 rounded-xl border border-input bg-background p-2 shadow-xs motion-state focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
		className
	)}
	onsubmit={(event) => {
		event.preventDefault();
		submit();
	}}
	{...restProps}
	{onpaste}
	{ondragover}
	{ondrop}
>
	{#if drawer}
		<div data-slot="chat-composer-drawer" class="w-full">
			{@render drawer()}
		</div>
	{/if}
	{#if headerActions}
		<div data-slot="chat-composer-header" class="flex items-center gap-1 self-start">
			{@render headerActions()}
		</div>
	{/if}
	<div class="flex items-end gap-2">
		<TextareaPrimitive
			bind:ref={textarea}
			bind:value
			id="{uid}-message"
			name="message"
			{placeholder}
			{disabled}
			{onkeydown}
			rows={1}
			aria-label={placeholder}
			style="max-height: {maxHeight}"
			class="[field-sizing:content] min-h-8 flex-1 resize-none border-0 bg-transparent px-2 py-1.5 text-sm shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
		/>
		{@render actions?.()}
		<Swap key={busy} effect="fade" class="shrink-0">
			{#if busy}
				<Button
					type="button"
					size="icon-sm"
					aria-label={stopLabel}
					onclick={() => onStop?.()}
					data-slot="chat-stop-button"
					class="tap-target shrink-0 rounded-full motion-press motion-state"
				>
					<Icon icon="stop" class="size-4" />
				</Button>
			{:else}
				<Button
					type="submit"
					size="icon-sm"
					aria-label={sendLabel}
					disabled={disabled || value.trim().length === 0}
					data-slot="chat-send-button"
					class="tap-target shrink-0 rounded-full motion-press motion-state"
				>
					<ArrowUpIcon class="size-4" />
				</Button>
			{/if}
		</Swap>
	</div>
</form>
