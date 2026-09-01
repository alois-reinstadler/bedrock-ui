<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	/** A content/typography list. For record rows, use the separate Item family. */
	let {
		ref = $bindable(null),
		class: className,
		variant = 'disc',
		start,
		dividers = false,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> & {
		variant?: 'plain' | 'disc' | 'decimal';
		start?: number;
		dividers?: boolean;
		children?: Snippet;
	} = $props();

	const tag = $derived(variant === 'decimal' ? 'ol' : 'ul');
	const plain = $derived(variant === 'plain' || dividers);
</script>

<svelte:element
	this={tag}
	bind:this={ref}
	data-slot="list"
	start={tag === 'ol' ? start : undefined}
	class={cn(
		'space-y-2',
		plain ? 'list-none pl-0' : 'pl-5 marker:text-muted-foreground',
		!plain && variant === 'disc' && 'list-disc',
		!plain && variant === 'decimal' && 'list-decimal',
		dividers && 'divide-y divide-border *:py-2 first:*:pt-0 last:*:pb-0',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
