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
	import { onDestroy } from 'svelte';
	import { createLayout } from '#lib/bedrock/motion/projection.js';
	import { Motion, Size } from '#lib/bedrock/motion/css.js';
	import { popLayout } from 'astra-motion/presence';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		items,
		max = 4,
		moreLabel = (count: number) => `Show ${count} more`,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
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

	// One card, shared across all triggers: it slides between avatars instead
	// of closing and reopening, and swaps its content.
	let active = $state<number | null>(null);
	let cardX = $state(0);
	let closeTimer: ReturnType<typeof setTimeout> | undefined;

	function show(event: Event, index: number) {
		clearTimeout(closeTimer);
		const trigger = event.currentTarget as HTMLElement;
		const stack = ref?.getBoundingClientRect();
		const box = trigger.getBoundingClientRect();
		if (stack) cardX = box.left - stack.left + box.width / 2;
		active = index;
	}

	function scheduleHide() {
		clearTimeout(closeTimer);
		closeTimer = setTimeout(() => (active = null), 150);
	}

	// Astra projection handles measured member packing; the preview uses CSS motion.
	const stackLayout = createLayout({ observationRoot: () => ref });
	const memberLayout = stackLayout({ mode: 'position' });
	onDestroy(() => clearTimeout(closeTimer));

	function memberKey(item: AvatarStackItem): string {
		return `${displayName(item)}|${item.src ?? ''}`;
	}

	const triggerClasses =
		'rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';
</script>

{#snippet memberRow(item: AvatarStackItem)}
	<span class="flex items-center gap-2 text-sm whitespace-nowrap" data-slot="avatar-stack-member">
		<Root class="size-6">
			{#if item.src}
				<Image src={item.src} alt={displayName(item)} />
			{/if}
			<Fallback class="text-[10px]">{item.fallback}</Fallback>
		</Root>
		{displayName(item)}
	</span>
{/snippet}

<div
	{@attach (node) => {
		ref = node;
		return () => {
			ref = null;
		};
	}}
	data-slot="avatar-stack"
	class={cn('relative inline-block', className)}
	{...restProps}
>
	<Group>
		{#each visible as item, index (memberKey(item))}
			<button
				{@attach memberLayout}
				type="button"
				aria-label={displayName(item)}
				class={triggerClasses}
				onmouseenter={(event) => show(event, index)}
				onmouseleave={scheduleHide}
				onfocus={(event) => show(event, index)}
				onblur={scheduleHide}
			>
				<Root class="ring-2 ring-background">
					{#if item.src}
						<Image src={item.src} alt={displayName(item)} />
					{/if}
					<Fallback>{item.fallback}</Fallback>
				</Root>
			</button>
		{/each}
		{#if hidden.length > 0}
			<button
				{@attach memberLayout}
				type="button"
				aria-label={moreLabel(hidden.length)}
				class={triggerClasses}
				onmouseenter={(event) => show(event, visible.length)}
				onmouseleave={scheduleHide}
				onfocus={(event) => show(event, visible.length)}
				onblur={scheduleHide}
			>
				<GroupCount>+{hidden.length}</GroupCount>
			</button>
		{/if}
	</Group>
	{#if active !== null}
		<div
			data-slot="avatar-stack-card"
			role="status"
			class="bedrock-avatar-card absolute bottom-full z-50 mb-2 w-max"
			style:left="{cardX}px"
			onmouseenter={() => clearTimeout(closeTimer)}
			onmouseleave={scheduleHide}
		>
			<Size
				class="overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md"
			>
				<div class="relative grid p-2" style:position="relative">
					{#key active}
						<Motion
							{@attach popLayout()}
							as="span"
							class="col-start-1 row-start-1 block"
							motion={{
								initial: { opacity: 0 },
								animate: { opacity: 1 },
								transition: { duration: 0.16 }
							}}
						>
							{#if active < visible.length}
								{@render memberRow(visible[active])}
							{:else}
								<span class="flex flex-col gap-1.5">
									{#each hidden as item, index (index)}
										{@render memberRow(item)}
									{/each}
								</span>
							{/if}
						</Motion>
					{/key}
				</div>
			</Size>
		</div>
	{/if}
</div>

<style>
	.bedrock-avatar-card {
		translate: -50% 0;
		transition:
			left var(--motion-enter) var(--motion-ease-move),
			opacity var(--motion-state) var(--motion-ease-enter);
	}

	@starting-style {
		.bedrock-avatar-card {
			opacity: 0;
		}
	}
</style>
