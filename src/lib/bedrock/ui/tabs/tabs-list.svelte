<script lang="ts" module>
	export * from '#lib/shadcn/ui/tabs/tabs-list.svelte';
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { createMotion } from '#lib/bedrock/motion/css.js';
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
		 * active trigger and animated by Astra CSS transitions, so it
		 * survives interruption and container scrolling. Applies to the default
		 * variant in both orientations; the `line` variant keeps its
		 * per-trigger underline. */
		indicator?: boolean;
	} = $props();

	let pill = $state({ x: 0, y: 0, width: 0, height: 0, visible: false });
	// Reflects whether the sliding pill owns the active background right now;
	// drives the data attribute the trigger styles key off.
	let owned = $state(false);

	const indicatorMotion = createMotion(() => ({
		animate: { x: pill.x, y: pill.y, width: pill.width, height: pill.height },
		transition: { duration: 0.2 }
	}));

	function measure() {
		const list = ref;
		if (!list) return;
		const variant = list.getAttribute('data-variant') ?? 'default';
		const on = indicator && variant === 'default';
		owned = on;
		const trigger = on ? list.querySelector<HTMLElement>('[data-state="active"]') : null;
		if (!trigger) {
			// A literal (never a spread of current state) — reading `pill` here
			// would make the calling $effect depend on what it writes and loop.
			pill = { x: 0, y: 0, width: 0, height: 0, visible: false };
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
		// measure() writes state the effect must not depend on.
		untrack(measure);
		const mutations = new MutationObserver(() => measure());
		mutations.observe(list, { subtree: true, attributes: true, attributeFilter: ['data-state'] });
		const sizes = new ResizeObserver(() => measure());
		sizes.observe(list);
		for (const trigger of list.querySelectorAll<HTMLElement>('[role="tab"]'))
			sizes.observe(trigger);
		return () => {
			mutations.disconnect();
			sizes.disconnect();
		};
	});
</script>

<TabsList
	bind:ref
	data-bedrock-indicator={owned ? '' : undefined}
	class={cn('relative', className)}
	{...restProps}
>
	{#if pill.visible}
		<span
			{...indicatorMotion.props}
			aria-hidden="true"
			data-slot="tabs-indicator"
			class="absolute top-0 left-0 rounded-md border border-transparent bg-background shadow-sm dark:border-input dark:bg-input/30"
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
