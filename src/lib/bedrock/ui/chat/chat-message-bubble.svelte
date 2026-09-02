<script lang="ts" module>
	export type ChatMessageBubbleGroup = 'first' | 'middle' | 'last';
	export type ChatMessageBubbleVariant = 'filled' | 'ghost';

	// Consecutive bubbles from one sender read as a single flow: the
	// sender-side corners between neighbours shrink, and only the last
	// bubble keeps the small tail.
	const groupClasses: Record<ChatMessageBubbleGroup, string> = {
		first:
			'group-data-[role=assistant]/chat-message:rounded-bl-md group-data-[role=user]/chat-message:rounded-br-md',
		middle:
			'group-data-[role=assistant]/chat-message:rounded-l-md group-data-[role=user]/chat-message:rounded-r-md',
		last: 'group-data-[role=assistant]/chat-message:rounded-tl-md group-data-[role=user]/chat-message:rounded-tr-md'
	};
</script>

<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		group,
		variant = 'filled',
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		/** Position within a run of consecutive bubbles from the same sender. */
		group?: ChatMessageBubbleGroup;
		/** `ghost` keeps padding and alignment but no background — for content that brings its own surfaces. */
		variant?: ChatMessageBubbleVariant;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="chat-message-bubble"
	data-group={group}
	data-variant={variant}
	class={cn(
		'max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed break-words md:max-w-[75%]',
		'group-data-[role=assistant]/chat-message:rounded-bl-sm group-data-[role=user]/chat-message:rounded-br-sm',
		variant === 'filled'
			? 'group-data-[role=assistant]/chat-message:bg-muted group-data-[role=assistant]/chat-message:text-foreground group-data-[role=user]/chat-message:bg-primary group-data-[role=user]/chat-message:text-primary-foreground'
			: 'bg-transparent text-foreground',
		group && groupClasses[group],
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
