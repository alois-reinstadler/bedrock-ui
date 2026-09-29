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
	data-slot="attachment-actions"
	class={cn(
		'relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:right-3 group-data-[orientation=vertical]/attachment:gap-1',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
