<script lang="ts">
	import { onDestroy, tick } from 'svelte';
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
	let pending = $state(false);
	let failed = $state(false);
	let disposed = false;
	let textarea: HTMLTextAreaElement;
	onDestroy(() => {
		disposed = true;
	});
	async function save() {
		if (disabled || pending || !value.trim()) return;
		pending = true;
		failed = false;
		try {
			await onSave(value.trim());
		} catch {
			if (!disposed) failed = true;
		} finally {
			if (!disposed) {
				pending = false;
				await tick();
				if (!disposed) textarea?.focus();
			}
		}
	}
	function focus(node: HTMLTextAreaElement) {
		textarea = node;
		node.focus();
	}
</script>

<form
	data-slot="chat-message-editor"
	aria-label={label}
	aria-busy={pending}
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
		disabled={disabled || pending}
		aria-describedby={failed ? `${uid}-error` : undefined}
		rows={3}
		onkeydown={(event) => {
			if (event.isComposing) return;
			if (event.key === 'Escape' && !disabled && !pending) {
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
			disabled={disabled || pending}
			onclick={onCancel}>{cancelLabel}</Button
		>
		<Button type="submit" size="sm" disabled={disabled || pending || !value.trim()}
			>{pending ? savingLabel : saveLabel}</Button
		>
	</div>
	{#if failed}<p id="{uid}-error" role="alert" class="text-sm text-destructive">
			{errorLabel}
		</p>{/if}
</form>
