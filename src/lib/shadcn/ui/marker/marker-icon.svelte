<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();

	function attachRef(element: HTMLElement) {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}
</script>

<span
	{@attach attachRef}
	data-slot="marker-icon"
	aria-hidden="true"
	class={cn("size-4 shrink-0 [&_svg:not([class*='size-'])]:size-4", className)}
	{...restProps}
>
	{@render children?.()}
</span>
