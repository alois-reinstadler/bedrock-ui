<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	function attachRef(element: HTMLElement) {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}
</script>

<div
	{@attach attachRef}
	data-slot="attachment-group"
	class={cn(
		'flex min-w-0 snap-x snap-mandatory scroll-px-1 gap-3 overflow-x-auto overscroll-x-contain py-1 *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
