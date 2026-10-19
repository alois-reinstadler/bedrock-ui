<script lang="ts">
	import { tick } from 'svelte';
	import { createChatAction } from './agent-action.svelte';
	import { Button } from '#lib/bedrock/ui/button';
	import { Textarea } from '#lib/bedrock/ui/textarea';
	import { cn } from '#lib/utils.js';
	let {
		value = $bindable(''),
		onSave,
		onCancel,
		disabled = false,
		label = 'Edit message',
		saveLabel = 'Save and resend',
		cancelLabel = 'Cancel editing',
		savingLabel = 'Saving…',
		errorLabel = 'Could not resend. Your edits are saved here. Try again.',
		class: className
	}: {
		value?: string;
		onSave: (text: string) => void | Promise<void>;
		onCancel: () => void;
		disabled?: boolean;
		label?: string;
		saveLabel?: string;
		cancelLabel?: string;
		savingLabel?: string;
		errorLabel?: string;
		class?: string;
	} = $props();
	const uid = $props.id();
	const action = createChatAction();
	let textarea: HTMLTextAreaElement;
	async function save() {
		if (disabled || action.pending || !value.trim()) return;
		await action.run(() => onSave(value.trim()));
		await tick();
		if (textarea?.isConnected) textarea.focus();
	}

	function focus(node: HTMLTextAreaElement) {
		textarea = node;
		node.focus();
	}
</script>

<form
	data-slot="chat-message-editor"
	aria-label={label}
	aria-busy={action.pending}
	class={cn('flex w-full min-w-0 flex-col gap-2 rounded-lg border bg-background p-3', className)}
	onsubmit={(event) => {
		event.preventDefault();
		void save();
	}}
>
	<label for={uid} class="text-xs font-medium">{label}</label>
	<Textarea
		{@attach focus}
		id={uid}
		bind:value
		disabled={disabled || action.pending}
		aria-describedby={action.failed ? `${uid}-error` : undefined}
		rows={3}
		onkeydown={(event) => {
			if (event.isComposing) return;
			if (event.key === 'Escape' && !disabled && !action.pending) {
				event.preventDefault();
				onCancel();
			}
			if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
				event.preventDefault();
				void save();
			}
		}}
	/>
	<div class="flex flex-wrap justify-end gap-2">
		<Button
			type="button"
			variant="ghost"
			size="sm"
			disabled={disabled || action.pending}
			onclick={onCancel}>{cancelLabel}</Button
		>
		<Button type="submit" size="sm" disabled={disabled || action.pending || !value.trim()}
			>{action.pending ? savingLabel : saveLabel}</Button
		>
	</div>
	{#if action.failed}<p id="{uid}-error" role="alert" class="text-sm text-destructive">
			{errorLabel}
		</p>{/if}
</form>
