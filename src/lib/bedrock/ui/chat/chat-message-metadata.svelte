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
	data-slot="chat-message-metadata"
	class={cn('flex items-center gap-1.5 px-1 text-xs text-muted-foreground', className)}
	{...restProps}
>
	{@render children?.()}
</div>
