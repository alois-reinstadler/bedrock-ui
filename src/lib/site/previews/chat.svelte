<script lang="ts">
	import * as Chat from '#lib/bedrock/ui/chat';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { StatusDot } from '#lib/bedrock/ui/status-dot';
	import PackageCheckIcon from '@lucide/svelte/icons/package-check';
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

<Chat.Root
	class="mx-auto h-[24rem] w-full max-w-xl overflow-hidden rounded-2xl border bg-background shadow-sm"
>
	<header class="flex items-center gap-3 border-b px-5 py-4">
		<span class="flex size-9 items-center justify-center rounded-xl bg-muted"
			><Icon icon={PackageCheckIcon} class="size-5" /></span
		>
		<div class="min-w-0 flex-1">
			<h3 class="text-sm font-semibold">Delivery assistant</h3>
			<p class="text-xs text-muted-foreground">Order updates, in one place</p>
		</div>
		<StatusDot status="success" label="Available" />
	</header>
	<Chat.MessageList>
		{#each messages as message (message.id)}
			<Chat.Message role={message.role} class="gap-2">
				{#if message.role === 'assistant'}
					<div class="w-full space-y-4 py-2">
						<Chat.Activity
							steps={[
								{
									id: 'orders',
									title: 'Checked 14 orders',
									kind: 'tool',
									status: 'complete',
									duration: '1.2s',
									detail: '12 delivered · 2 in transit. No delivery exceptions reported.'
								}
							]}
						/>
						<p class="text-sm leading-relaxed">
							{message.text} Everything is on track for this week.
						</p>
						<div class="grid grid-cols-2 gap-2">
							<div class="rounded-xl bg-muted/50 p-3">
								<p class="text-xs text-muted-foreground">Delivered</p>
								<p class="mt-1 text-2xl font-semibold tracking-tight">
									12<span class="ml-1 text-xs font-normal text-muted-foreground">/ 14</span>
								</p>
							</div>
							<div class="rounded-xl bg-muted/50 p-3">
								<p class="text-xs text-muted-foreground">In transit</p>
								<p class="mt-1 text-2xl font-semibold tracking-tight">
									2<span class="ml-1 text-xs font-normal text-muted-foreground">orders</span>
								</p>
							</div>
						</div>
						<Chat.Sources
							sources={[
								{
									id: 'orders',
									title: 'Order summary',
									kind: 'Order data',
									description: '14 orders · updated just now',
									excerpt: 'Two remaining orders are scheduled for delivery this week.'
								}
							]}
						/>
					</div>
				{:else}<Chat.MessageBubble class="bg-muted text-foreground"
						>{message.text}</Chat.MessageBubble
					>{/if}
				<Chat.MessageMetadata><Timestamp date={message.at} /></Chat.MessageMetadata>
			</Chat.Message>
		{/each}
	</Chat.MessageList>
	<div class="p-4 pt-2"><Chat.Composer onSend={send} /></div>
</Chat.Root>
