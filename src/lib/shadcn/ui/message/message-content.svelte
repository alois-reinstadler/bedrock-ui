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
	data-slot="message-content"
	class={cn(
		'flex w-full min-w-0 flex-col gap-2.5 wrap-break-word group-data-[align=end]/message:*:data-slot:self-end',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
