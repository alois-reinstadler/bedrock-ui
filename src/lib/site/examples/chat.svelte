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
