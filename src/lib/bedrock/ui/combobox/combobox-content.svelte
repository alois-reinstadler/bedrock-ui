<script lang="ts">
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import ChevronUpIcon from '@lucide/svelte/icons/chevron-up';
	import { Combobox as ComboboxPrimitive } from 'bits-ui';
	import { cn, type WithoutChild } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 4,
		children,
		...restProps
	}: WithoutChild<ComboboxPrimitive.ContentProps> = $props();
</script>

<ComboboxPrimitive.Portal>
	<ComboboxPrimitive.Content
		bind:ref
		{sideOffset}
		data-slot="combobox-content"
		class={cn(
			'relative isolate z-50 max-h-72 min-w-36 motion-popover overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
			className
		)}
		{...restProps}
	>
		<ComboboxPrimitive.ScrollUpButton
			class="z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4"
		>
			<ChevronUpIcon />
		</ComboboxPrimitive.ScrollUpButton>
		<ComboboxPrimitive.Viewport class="w-full min-w-(--bits-select-anchor-width) scroll-my-1">
			{@render children?.()}
		</ComboboxPrimitive.Viewport>
		<ComboboxPrimitive.ScrollDownButton
			class="z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4"
		>
			<ChevronDownIcon />
		</ComboboxPrimitive.ScrollDownButton>
	</ComboboxPrimitive.Content>
</ComboboxPrimitive.Portal>
