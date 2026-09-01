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
	data-slot="chat-system-message"
	role="status"
	class={cn(
		'self-center rounded-full bg-muted px-3 py-1 text-center text-xs text-muted-foreground',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
