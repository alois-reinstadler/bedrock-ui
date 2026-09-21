<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import { cn, type WithoutChild } from '#lib/utils.js';
	import { reveal } from '#lib/bedrock/motion/index.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		forceMount = false,
		hiddenUntilFound = false,
		...restProps
	}: WithoutChild<AccordionPrimitive.ContentProps> = $props();
</script>

<!-- Svelte owns retention and reversal. Two independent CSS keyframes restore
     intrinsic height before Bits hides a closing panel, causing a final flash. -->
<AccordionPrimitive.Content
	bind:ref
	forceMount
	{hiddenUntilFound}
	data-slot="accordion-content"
	class="overflow-hidden text-sm"
	{...restProps}
>
	{#snippet child({ props, open })}
		{#if open || forceMount || hiddenUntilFound}
			<div {...props} transition:reveal>
				<div
					class={cn(
						'pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4',
						className
					)}
				>
					{@render children?.()}
				</div>
			</div>
		{/if}
	{/snippet}
</AccordionPrimitive.Content>
