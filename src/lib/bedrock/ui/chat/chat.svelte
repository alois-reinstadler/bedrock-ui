<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		isEmpty = false,
		empty,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		/** The consumer marks the conversation empty; no DOM sniffing. */
		isEmpty?: boolean;
		/** Rendered centered while `isEmpty` — suggestions, a greeting, etc. */
		empty?: Snippet;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="chat"
	class={cn('flex h-full min-h-0 flex-col', className)}
	{...restProps}
>
	{#if empty && isEmpty}
		<div
			data-slot="chat-empty"
			class="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-6 text-center"
		>
			{@render empty()}
		</div>
	{/if}
	{@render children?.()}
</div>
