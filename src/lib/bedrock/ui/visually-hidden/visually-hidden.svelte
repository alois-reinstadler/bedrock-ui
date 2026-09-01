<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> = $props();
</script>

<span bind:this={ref} data-slot="visually-hidden" class={cn('sr-only', className)} {...restProps}>
	{@render children?.()}
</span>
