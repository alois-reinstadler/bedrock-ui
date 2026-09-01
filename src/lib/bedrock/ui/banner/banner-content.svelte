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
	data-slot="banner-content"
	class={cn('flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5', className)}
	{...restProps}
>
	{@render children?.()}
</div>
