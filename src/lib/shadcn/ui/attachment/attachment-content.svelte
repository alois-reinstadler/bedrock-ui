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
	data-slot="attachment-content"
	class={cn(
		'max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
