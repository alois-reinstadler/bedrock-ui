<script lang="ts">
	import { tick } from 'svelte';
	import * as Chat from '#lib/bedrock/ui/chat';
	import { Button } from '#lib/bedrock/ui/button';
	let text = $state('Summarize the release notes.');
	let draft = $state('');
	let editing = $state(false);
	let status = $state<Chat.ChatMessageStatus>('failed');
	let feedback = $state<'up' | 'down' | null>(null);
	let failNext = $state(false);
	let surface: HTMLElement;
	async function finishEditing() {
		editing = false;
		await tick();
		surface.querySelector<HTMLButtonElement>('[aria-label="Edit message"]')?.focus();
	}
	async function retry() {
		if (failNext) {
			failNext = false;
			throw new Error('Simulated failure');
		}
		status = 'sent';
	}
	async function save(value: string) {
		await retry();
		text = value;
		await finishEditing();
	}
	function cancel() {
		void finishEditing();
	}
</script>

<section
	{@attach (node) => {
		surface = node;
	}}
	data-demo="chat-recovery"
	class="w-full max-w-xl space-y-5"
>
	<p class="text-sm text-muted-foreground">
		Recover a failed message or edit it before resending. This demo updates messages locally.
	</p>
	<Chat.Message role="user">
		{#if editing}<Chat.MessageEditor bind:value={draft} onSave={save} onCancel={cancel} />
		{:else}
			<Chat.MessageBubble>{text}</Chat.MessageBubble>
			<Chat.MessageActions
				onEdit={() => {
					draft = text;
					editing = true;
				}}
			/>
			<Chat.MessageStatus {status} onRetry={retry} />
		{/if}
	</Chat.Message>
	<Chat.Message role="assistant">
		<Chat.MessageBubble>The release improves search and adds export options.</Chat.MessageBubble>
		<Chat.MessageActions {feedback} onFeedbackChange={(next) => (feedback = next)} />
		<p role="status" class="text-xs text-muted-foreground">
			{feedback
				? `Feedback saved: ${feedback === 'up' ? 'helpful' : 'not helpful'}.`
				: 'No feedback selected.'}
		</p>
	</Chat.Message>
	<div class="flex flex-wrap gap-2">
		<Button
			variant="outline"
			size="sm"
			onclick={() => {
				status = 'failed';
				failNext = true;
			}}>Simulate failed retry</Button
		>
		<Button variant="outline" size="sm" onclick={() => (status = 'interrupted')}
			>Show interrupted response</Button
		>
	</div>
	<div class="flex flex-wrap gap-4 border-t pt-3">
		<Chat.MessageStatus status="sending" /><Chat.MessageStatus
			status="waiting"
		/><Chat.MessageStatus status="streaming" />
	</div>
</section>
