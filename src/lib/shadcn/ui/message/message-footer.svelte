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
	data-slot="message-footer"
	class={cn(
		'flex max-w-full min-w-0 items-center px-3 text-xs font-medium text-muted-foreground group-has-data-[variant=ghost]/message:px-0 group-data-[align=end]/message:justify-end',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
