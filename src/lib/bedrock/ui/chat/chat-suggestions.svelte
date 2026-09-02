<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		items,
		onSelect,
		...restProps
	}: Omit<WithElementRef<HTMLAttributes<HTMLDivElement>>, 'children'> & {
		items: string[];
		onSelect: (item: string) => void;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="chat-suggestions"
	class={cn('flex flex-wrap items-center justify-center gap-2', className)}
	{...restProps}
>
	{#each items as item (item)}
		<Button
			variant="secondary"
			size="sm"
			data-slot="chat-suggestion"
			class="tap-target rounded-full font-normal motion-press motion-state"
			onclick={() => onSelect(item)}
		>
			{item}
		</Button>
	{/each}
</div>
