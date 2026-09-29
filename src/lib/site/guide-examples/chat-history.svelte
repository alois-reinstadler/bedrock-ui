<script lang="ts">
	import * as Chat from '#lib/bedrock/ui/chat';
	import { Button } from '#lib/bedrock/ui/button';
	let phase = $state<'ready' | 'loading' | 'error'>('ready');
	let messages = $state<{ id: number; text: string }[]>([]);
	let pages = $state(0);
	let failNext = $state(false);
	let prompt = $state('');
	async function loadMore() {
		if (failNext) {
			failNext = false;
			throw new Error('Simulated history failure');
		}
		// A real app awaits its history API here, then prepends with stable keys.
		const before = messages[0]?.id ?? 1;
		messages = [
			...Array.from({ length: 6 }, (_, i) => ({
				id: before - 6 + i,
				text: `Earlier message ${before - 6 + i}: The release is ready for review.`
			})),
			...messages
		];
		pages++;
	}
	function loadConversation() {
		phase = 'ready';
		pages = 0;
		messages = Array.from({ length: 8 }, (_, i) => ({
			id: i + 1,
			text: `Message ${i + 1}: Let’s review the next release together.`
		}));
	}
</script>

<section data-demo="chat-history" class="w-full max-w-xl space-y-3">
	<div class="flex flex-wrap gap-2">
		<Button
			size="sm"
			variant="outline"
			onclick={() => {
				phase = 'ready';
				messages = [];
			}}>Empty</Button
		>
		<Button size="sm" variant="outline" onclick={() => (phase = 'loading')}>Loading</Button>
		<Button size="sm" variant="outline" onclick={() => (phase = 'error')}>Load error</Button>
		<Button size="sm" variant="outline" onclick={loadConversation}>Show conversation</Button>
		<Button
			size="sm"
			variant="outline"
			onclick={() => {
				loadConversation();
				failNext = true;
			}}>Fail next history load</Button
		>
	</div>
	<Chat.Root
		class="h-80 rounded-lg border"
		state={phase}
		isEmpty={messages.length === 0}
		onRetry={loadConversation}
	>
		{#snippet empty()}<p class="font-medium">What would you like to explore?</p>
			<Chat.Suggestions
				items={['Plan a release', 'Review an idea']}
				onSelect={(item) => (prompt = item)}
			/>{/snippet}
		{#if phase === 'ready' && messages.length}
			<Chat.MessageList hasMore={pages < 2} onLoadMore={loadMore} newMessagesLabel="New messages">
				{#each messages as message (message.id)}<Chat.Message
						data-message-id={message.id}
						role="assistant"><Chat.MessageBubble>{message.text}</Chat.MessageBubble></Chat.Message
					>{/each}
			</Chat.MessageList>
		{/if}
		<div class="p-3">
			<Chat.Composer
				bind:value={prompt}
				disabled={phase !== 'ready'}
				onSend={(text) => {
					messages = [...messages, { id: (messages.at(-1)?.id ?? 0) + 1, text }];
				}}
			/>
		</div>
	</Chat.Root>
</section>
