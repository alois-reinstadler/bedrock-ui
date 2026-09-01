<script lang="ts" module>
	export type AvatarStackItem = {
		src?: string | null;
		alt?: string;
		/** Short fallback text, e.g. initials. */
		fallback: string;
		/** Display name for the hover preview; falls back to `alt`, then `fallback`. */
		name?: string;
	};
</script>

<script lang="ts">
	import Fallback from '#lib/shadcn/ui/avatar/avatar-fallback.svelte';
	import GroupCount from '#lib/shadcn/ui/avatar/avatar-group-count.svelte';
	import Group from '#lib/shadcn/ui/avatar/avatar-group.svelte';
	import Image from '#lib/shadcn/ui/avatar/avatar-image.svelte';
	import Root from '#lib/shadcn/ui/avatar/avatar.svelte';
	import { Preview } from '#lib/bedrock/ui/hover-card';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		items,
		max = 4,
		moreLabel = (count: number) => `${count} weitere anzeigen`,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		items: AvatarStackItem[];
		/** Avatars shown before collapsing the rest into a "+n" count. */
		max?: number;
		/** Accessible label for the "+n" count. */
		moreLabel?: (count: number) => string;
	} = $props();

	const visible = $derived(items.length > max ? items.slice(0, max) : items);
	const hidden = $derived(items.length > visible.length ? items.slice(visible.length) : []);

	function displayName(item: AvatarStackItem): string {
		return item.name ?? item.alt ?? item.fallback;
	}
</script>

{#snippet memberRow(item: AvatarStackItem)}
	<span class="flex items-center gap-2 text-sm" data-slot="avatar-stack-member">
		<Root class="size-6">
			{#if item.src}
				<Image src={item.src} alt={displayName(item)} />
			{/if}
			<Fallback class="text-[10px]">{item.fallback}</Fallback>
		</Root>
		{displayName(item)}
	</span>
{/snippet}

<Group bind:ref data-slot="avatar-stack" class={cn(className)} {...restProps}>
	{#each visible as item, index (index)}
		<Preview>
			{#snippet trigger({ props })}
				<button
					{...props}
					type="button"
					aria-label={displayName(item)}
					class="rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
				>
					<Root class="ring-2 ring-background">
						{#if item.src}
							<Image src={item.src} alt={displayName(item)} />
						{/if}
						<Fallback>{item.fallback}</Fallback>
					</Root>
				</button>
			{/snippet}
			{@render memberRow(item)}
		</Preview>
	{/each}
	{#if hidden.length > 0}
		<Preview align="end" contentClass="flex-col items-start">
			{#snippet trigger({ props })}
				<button
					{...props}
					type="button"
					aria-label={moreLabel(hidden.length)}
					class="rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
				>
					<GroupCount>+{hidden.length}</GroupCount>
				</button>
			{/snippet}
			<span class="flex flex-col gap-1.5">
				{#each hidden as item, index (index)}
					{@render memberRow(item)}
				{/each}
			</span>
		</Preview>
	{/if}
</Group>
