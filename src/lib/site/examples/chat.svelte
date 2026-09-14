<script lang="ts">
	import * as Chat from '#lib/bedrock/ui/chat';
	import { Timestamp } from '#lib/bedrock/ui/timestamp';

	type Message = { id: number; role: 'user' | 'assistant'; text: string; at: number };
	let nextId = 3;
	let messages = $state<Message[]>([
		{
			id: 1,
			role: 'user',
			text: 'Can you summarize the delivery status?',
			at: Date.now() - 300_000
		},
		{
			id: 2,
			role: 'assistant',
			text: '12 of 14 orders are delivered; two are still in transit.',
			at: Date.now() - 240_000
		}
	]);

	function send(text: string) {
		messages = [...messages, { id: nextId++, role: 'user', text, at: Date.now() }];
	}
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Delivery support conversation</h3>
		<p class="text-sm text-muted-foreground">
			Keep the order context beside the conversation. Messages stay local and no automated reply is
			implied.
		</p>
	</header>
	<div class="rounded-lg border bg-muted/30 p-3 text-sm">
		<p class="font-medium">Order FN-2048 · Delivery support</p>
		<p class="text-muted-foreground">
			This is a local conversation example. Sending adds your message to the thread.
		</p>
	</div>

	<Chat.Root class="h-80 max-w-xl rounded-lg border">
		<Chat.MessageList>
			<Chat.SystemMessage>Today</Chat.SystemMessage>
			{#each messages as message (message.id)}
				<Chat.Message role={message.role}>
					<Chat.MessageBubble>{message.text}</Chat.MessageBubble>
					<Chat.MessageMetadata><Timestamp date={message.at} /></Chat.MessageMetadata>
				</Chat.Message>
			{/each}
		</Chat.MessageList>
		<div class="p-3 pt-0">
			<Chat.Composer onSend={send} />
		</div>
	</Chat.Root>
</section>
