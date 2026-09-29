<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		align = 'start',
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		align?: 'start' | 'end';
	} = $props();

	function attachRef(element: HTMLElement) {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}
</script>

<div
	{@attach attachRef}
	data-slot="message"
	data-align={align}
	class={cn(
		'group/message relative flex w-full min-w-0 gap-2 text-sm data-[align=end]:flex-row-reverse',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
