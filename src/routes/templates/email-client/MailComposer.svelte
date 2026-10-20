<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import SendIcon from '@lucide/svelte/icons/send';
	import { Button } from '#lib/bedrock/ui/button';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { Input } from '#lib/bedrock/ui/input';
	import { Label } from '#lib/bedrock/ui/label';
	import { Textarea } from '#lib/bedrock/ui/textarea';

	import { useWorkspace } from '#lib/templates/email-client/workspace.svelte.js';
	const workspace = useWorkspace();
	let {
		sendMessage,
		saveDraft,
		closeCompose
	}: {
		sendMessage: (event: SubmitEvent) => void;
		saveDraft: () => void;
		closeCompose: () => Promise<void>;
	} = $props();
</script>

<form class="compose-pane" aria-labelledby="compose-heading" onsubmit={sendMessage}>
	<header class="border-b px-5 py-4">
		<div class="mb-2 flex items-center gap-3">
			<Button type="button" variant="ghost" size="sm" onclick={saveDraft}
				><ArrowLeftIcon class="size-4" />Back</Button
			>
			<h2 id="compose-heading" class="text-lg font-semibold">
				{workspace.compose.replyId ? 'Reply' : 'New message'}
			</h2>
		</div>
		<p class="text-xs text-muted-foreground">
			Local demo: messages appear in Sent. No email leaves this page.
		</p>
	</header>
	<div class="grid gap-4 p-5">
		<div class="grid gap-1.5">
			<Label for="compose-to">To</Label>
			<Input
				id="compose-to"
				value={workspace.compose.to}
				oninput={(event) => (workspace.compose.to = event.currentTarget.value)}
				name="to"
				type="email"
				placeholder="name@example.com"
				required
			/>
		</div>
		<div class="grid gap-1.5">
			<Label for="compose-subject">Subject</Label>
			<Input
				id="compose-subject"
				value={workspace.compose.subject}
				oninput={(event) => (workspace.compose.subject = event.currentTarget.value)}
				name="subject"
				placeholder="What is this about?"
				required
			/>
		</div>
		<div class="grid gap-1.5">
			<Label for="compose-body">Message</Label>
			<Textarea
				id="compose-body"
				value={workspace.compose.body}
				oninput={(event) => (workspace.compose.body = event.currentTarget.value)}
				name="body"
				class="min-h-52 resize-none"
				placeholder="Write your message…"
				required
			/>
		</div>
	</div>
	<footer class="flex flex-wrap justify-end gap-2 border-t bg-muted/35 px-5 py-3">
		<Button variant="ghost" type="button" onclick={closeCompose}>Cancel</Button>
		<Button type="button" variant="outline" onclick={saveDraft}>Save draft</Button><Button
			type="submit"><Icon icon={SendIcon} />Send message</Button
		>
	</footer>
</form>

<style>
	.compose-pane {
		min-height: 0;
		overflow-y: auto;
		height: 100%;
		background: var(--card);
	}
	.compose-pane {
		grid-row: 1 / -1;
		min-height: 0;
		overflow-y: auto;
		padding-bottom: 60px;
	}
</style>
