<script lang="ts" generics="T">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		items,
		item,
		overflow,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
		items: T[];
		item: Snippet<[T, number]>;
		/** Custom "+n" affordance (e.g. a dropdown trigger); receives the hidden items. */
		overflow?: Snippet<[T[]]>;
	} = $props();

	let rail = $state<HTMLDivElement | null>(null);
	let visibleCount = $state(Infinity);

	const clampedCount = $derived(Math.min(items.length, Math.max(visibleCount, 0)));
	const visibleItems = $derived(clampedCount < items.length ? items.slice(0, clampedCount) : items);
	const hiddenItems = $derived(clampedCount < items.length ? items.slice(clampedCount) : []);

	// The rail renders every item plus the indicator invisibly and never
	// depends on visibleCount, so measuring it cannot feed back into itself.
	function measure() {
		if (!ref || !rail) return;
		const children = Array.from(rail.children) as HTMLElement[];
		if (children.length === 0) return;
		const indicator = children[children.length - 1];
		const widths = children.slice(0, -1).map((child) => child.offsetWidth);
		const gap = Number.parseFloat(getComputedStyle(ref).columnGap) || 0;
		const available = ref.clientWidth;

		let total = 0;
		for (let index = 0; index < widths.length; index += 1) {
			total += widths[index] + (index > 0 ? gap : 0);
		}
		if (total <= available) {
			visibleCount = widths.length;
			return;
		}

		let used = 0;
		let fit = 0;
		const reserve = indicator.offsetWidth;
		for (let index = 0; index < widths.length; index += 1) {
			const next = used + widths[index] + (index > 0 ? gap : 0);
			if (next + gap + reserve > available) break;
			used = next;
			fit = index + 1;
		}
		visibleCount = fit;
	}

	$effect(() => {
		if (!ref) return;
		const observer = new ResizeObserver(() => measure());
		observer.observe(ref);
		return () => observer.disconnect();
	});

	$effect(() => {
		// Item changes re-render the rail; measure once the DOM settled.
		void items;
		measure();
	});
</script>

<div
	bind:this={ref}
	data-slot="overflow-list"
	class={cn('relative flex min-w-0 items-center gap-2 overflow-hidden', className)}
	{...restProps}
>
	{#each visibleItems as entry, index (index)}
		<span data-slot="overflow-list-item" class="flex-none">{@render item(entry, index)}</span>
	{/each}
	{#if hiddenItems.length > 0}
		<span data-slot="overflow-list-indicator" class="flex-none">
			{#if overflow}
				{@render overflow(hiddenItems)}
			{:else}
				<span
					class="inline-flex items-center rounded-md border border-border bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground"
				>
					+{hiddenItems.length}
				</span>
			{/if}
		</span>
	{/if}
	<div
		bind:this={rail}
		aria-hidden="true"
		inert
		class="pointer-events-none invisible absolute inset-x-0 top-0 flex items-center overflow-hidden whitespace-nowrap"
	>
		{#each items as entry, index (index)}
			<span class="flex-none">{@render item(entry, index)}</span>
		{/each}
		<span class="flex-none">
			{#if overflow}
				{@render overflow(items)}
			{:else}
				<span
					class="inline-flex items-center rounded-md border border-border bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground"
				>
					+{items.length}
				</span>
			{/if}
		</span>
	</div>
</div>
