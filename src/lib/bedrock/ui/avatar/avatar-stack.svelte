<script lang="ts" module>
	export type AvatarStackItem = {
		src?: string | null;
		alt?: string;
		/** Short fallback text, e.g. initials. */
		fallback: string;
	};
</script>

<script lang="ts">
	import Fallback from '#lib/shadcn/ui/avatar/avatar-fallback.svelte';
	import GroupCount from '#lib/shadcn/ui/avatar/avatar-group-count.svelte';
	import Group from '#lib/shadcn/ui/avatar/avatar-group.svelte';
	import Image from '#lib/shadcn/ui/avatar/avatar-image.svelte';
	import Root from '#lib/shadcn/ui/avatar/avatar.svelte';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		items,
		max = 4,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		items: AvatarStackItem[];
		/** Avatars shown before collapsing the rest into a "+n" count. */
		max?: number;
	} = $props();

	const visible = $derived(items.length > max ? items.slice(0, max) : items);
	const overflow = $derived(items.length - visible.length);
</script>

<Group bind:ref data-slot="avatar-stack" class={cn(className)} {...restProps}>
	{#each visible as item, index (index)}
		<Root>
			{#if item.src}
				<Image src={item.src} alt={item.alt ?? item.fallback} />
			{/if}
			<Fallback>{item.fallback}</Fallback>
		</Root>
	{/each}
	{#if overflow > 0}
		<GroupCount aria-label="{overflow} weitere">+{overflow}</GroupCount>
	{/if}
</Group>
