<script lang="ts">
	import { Icon, type IconType } from '#lib/bedrock/ui/icon';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLLiAttributes } from 'svelte/elements';

	/** A content-list entry. For structured record rows, use the separate Item family. */
	let {
		ref = $bindable(null),
		class: className,
		icon,
		children,
		...restProps
	}: WithElementRef<HTMLLiAttributes> & { icon?: IconType } = $props();
</script>

<li
	bind:this={ref}
	data-slot="list-item"
	class={cn(icon && 'flex list-none items-start gap-2', className)}
	{...restProps}
>
	{#if icon}
		<Icon {icon} class="mt-[0.2em] size-[1em]" />
	{/if}
	{#if icon}<span class="min-w-0">{@render children?.()}</span>{:else}{@render children?.()}{/if}
</li>
