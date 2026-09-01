<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="chat-message-bubble"
	class={cn(
		'max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed break-words md:max-w-[75%]',
		'group-data-[role=assistant]/chat-message:rounded-bl-sm group-data-[role=assistant]/chat-message:bg-muted group-data-[role=assistant]/chat-message:text-foreground',
		'group-data-[role=user]/chat-message:rounded-br-sm group-data-[role=user]/chat-message:bg-primary group-data-[role=user]/chat-message:text-primary-foreground',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
