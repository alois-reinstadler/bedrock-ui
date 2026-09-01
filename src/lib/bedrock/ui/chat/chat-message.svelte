<script lang="ts" module>
	export type ChatMessageRole = 'user' | 'assistant';
</script>

<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		role = 'assistant',
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		role?: ChatMessageRole;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="chat-message"
	data-role={role}
	class={cn(
		'bedrock-chat-message group/chat-message flex w-full flex-col gap-1',
		role === 'user' ? 'items-end' : 'items-start',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>

<style>
	.bedrock-chat-message {
		transition:
			translate var(--motion-enter) var(--motion-ease-enter),
			opacity var(--motion-enter) var(--motion-ease-enter);
	}

	@starting-style {
		.bedrock-chat-message {
			translate: 0 0.4rem;
			opacity: 0;
		}
	}
</style>
