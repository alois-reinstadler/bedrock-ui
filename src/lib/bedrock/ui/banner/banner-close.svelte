<script lang="ts">
	import XIcon from '@lucide/svelte/icons/x';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		'aria-label': ariaLabel = 'Close',
		...restProps
	}: WithElementRef<HTMLButtonAttributes, HTMLButtonElement> = $props();
</script>

<button
	bind:this={ref}
	type="button"
	data-slot="banner-close"
	aria-label={ariaLabel}
	class={cn(
		'tap-target ml-auto inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-foreground/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
		className
	)}
	{...restProps}
>
	<XIcon class="size-4" />
</button>
