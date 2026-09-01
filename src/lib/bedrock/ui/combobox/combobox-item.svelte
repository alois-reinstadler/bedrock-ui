<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import { Combobox as ComboboxPrimitive } from 'bits-ui';
	import { cn, type WithoutChild } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		value,
		label,
		children: childrenProp,
		...restProps
	}: WithoutChild<ComboboxPrimitive.ItemProps> = $props();
</script>

<ComboboxPrimitive.Item
	bind:ref
	{value}
	{label}
	data-slot="combobox-item"
	class={cn(
		"relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		className
	)}
	{...restProps}
>
	{#snippet children({ selected, highlighted })}
		<span class="absolute end-2 flex size-3.5 items-center justify-center">
			{#if selected}
				<CheckIcon class="size-4" />
			{/if}
		</span>
		<span class="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
			{#if childrenProp}
				{@render childrenProp({ selected, highlighted })}
			{:else}
				{label || value}
			{/if}
		</span>
	{/snippet}
</ComboboxPrimitive.Item>
