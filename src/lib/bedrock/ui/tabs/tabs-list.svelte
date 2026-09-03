<script lang="ts" module>
	export * from '#lib/shadcn/ui/tabs/tabs-list.svelte';
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import { createLayoutGroup, layout } from '#lib/bedrock/motion/index.js';
	import TabsList from '#lib/shadcn/ui/tabs/tabs-list.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		class: className,
		indicator = true,
		children,
		...restProps
	}: ComponentProps<typeof TabsList> & {
		/** One shared pill slides between triggers instead of each trigger
		 * toggling its own background. The pill is repositioned to the measured
		 * active trigger and animated by the shared-layout FLIP engine, so it
		 * survives interruption and container scrolling. Applies to the default
		 * variant in horizontal orientation; `line` and vertical tabs keep the
		 * per-trigger treatment. */
		indicator?: boolean;
	} = $props();

	let pill = $state({ x: 0, y: 0, width: 0, height: 0, visible: false });
	// Reflects whether the sliding pill owns the active background right now;
	// drives the data attribute the trigger styles key off.
	let owned = $state(false);

	// The tablist itself is the layout group root; the pill is its only
	// registered node, so discrete left/width updates below become spring
	// projections while everything else in the list stays immediate.
	const group = createLayoutGroup();
	const pillLayout = layout();
	onDestroy(() => group.destroy());

	function measure() {
		const list = ref;
		if (!list) return;
		const horizontal = list.getAttribute('data-orientation') !== 'vertical';
		const variant = list.getAttribute('data-variant') ?? 'default';
		const on = indicator && horizontal && variant === 'default';
		owned = on;
		const trigger = on ? list.querySelector<HTMLElement>('[data-state="active"]') : null;
		if (!trigger) {
			pill = { ...pill, visible: false };
			return;
		}
		pill = {
			x: trigger.offsetLeft,
			y: trigger.offsetTop,
			width: trigger.offsetWidth,
			height: trigger.offsetHeight,
			visible: true
		};
	}

	$effect(() => {
		void indicator;
		const list = ref;
		if (!list) return;
		measure();
		const mutations = new MutationObserver(() => measure());
		mutations.observe(list, { subtree: true, attributes: true, attributeFilter: ['data-state'] });
		const sizes = new ResizeObserver(() => measure());
		sizes.observe(list);
		return () => {
			mutations.disconnect();
			sizes.disconnect();
		};
	});
</script>

<TabsList
	bind:ref
	{@attach group.bindRoot}
	data-bedrock-indicator={owned ? '' : undefined}
	class={cn('relative', className)}
	{...restProps}
>
	{#if pill.visible}
		<span
			{@attach pillLayout}
			aria-hidden="true"
			data-slot="tabs-indicator"
			class="absolute rounded-md border border-transparent bg-background shadow-sm dark:border-input dark:bg-input/30"
			style:left="{pill.x}px"
			style:top="{pill.y}px"
			style:width="{pill.width}px"
			style:height="{pill.height}px"
		></span>
	{/if}
	{@render children?.()}
</TabsList>

<style>
	/* While the shared pill owns the active background, the trigger's own
	 * pill/border/shadow steps aside. Attribute selectors outrank the utility
	 * classes without needing !important. */
	:global([data-bedrock-indicator] [data-slot='tabs-trigger'][data-state='active']) {
		background-color: transparent;
		border-color: transparent;
		box-shadow: none;
	}
</style>
