<script lang="ts" module>
	export * from '#lib/shadcn/ui/tabs/tabs-list.svelte';
</script>

<script lang="ts">
	import TabsList from '#lib/shadcn/ui/tabs/tabs-list.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';
	import {
		positionIndicator,
		observeIndicatorSizes
	} from '#lib/bedrock/motion/shared-indicator.js';

	let {
		ref = $bindable(null),
		class: className,
		indicator = true,
		children,
		...restProps
	}: ComponentProps<typeof TabsList> & {
		/** One shared selection surface slides between triggers in either orientation:
		 * a pill for default tabs, an underline for line tabs. Set false for static indicators. */
		indicator?: boolean;
	} = $props();

	function trackIndicator(list: HTMLElement) {
		if (!indicator) return;
		let visible = false;
		const measure = () => {
			const mark = list.querySelector<HTMLElement>('[data-slot="tabs-indicator"]');
			if (!mark) return;
			const trigger = Array.from(
				list.querySelectorAll<HTMLElement>('[data-slot="tabs-trigger"][data-state="active"]')
			).find((trigger) => trigger.closest('[data-slot="tabs-list"]') === list);
			if (trigger) positionIndicator(list, mark, trigger, visible);
			visible = Boolean(trigger);
			mark.style.visibility = visible ? 'visible' : 'hidden';
			// Keep the primitive's selected styling until the shared surface is measured.
			list.toggleAttribute('data-bedrock-indicator', visible);
		};
		const sizes = observeIndicatorSizes(list, '[data-slot="tabs-trigger"]', measure);
		const mutations = new MutationObserver((records) => {
			if (records.some((record) => record.type === 'childList')) sizes.refresh();
			measure();
		});
		mutations.observe(list, {
			subtree: true,
			childList: true,
			characterData: true,
			attributes: true,
			attributeFilter: ['data-state', 'data-variant', 'data-orientation', 'class', 'dir']
		});
		measure();
		return () => {
			mutations.disconnect();
			sizes.disconnect();
			list.removeAttribute('data-bedrock-indicator');
		};
	}
</script>

<TabsList
	bind:ref
	class={cn('relative isolate', className)}
	{...restProps}
	{@attach trackIndicator}
>
	{#if indicator}
		<span
			aria-hidden="true"
			data-slot="tabs-indicator"
			class="pointer-events-none absolute rounded-md border border-transparent group-data-[variant=default]/tabs-list:bg-background group-data-[variant=default]/tabs-list:shadow-sm dark:group-data-[variant=default]/tabs-list:border-input dark:group-data-[variant=default]/tabs-list:bg-input/30"
			style="visibility: hidden"
		></span>
	{/if}
	{@render children?.()}
</TabsList>

<style>
	[data-slot='tabs-indicator'] {
		transition-property: left, top, width, height;
		transition-duration: var(--motion-layout);
		transition-timing-function: var(--motion-ease-enter);
	}

	/* Match the primitive underline, but retain one surface across selections. */
	:global([data-variant='line']) > [data-slot='tabs-indicator']::after {
		content: '';
		position: absolute;
		background: var(--foreground);
	}

	:global([data-variant='line'][data-orientation='horizontal'])
		> [data-slot='tabs-indicator']::after {
		inset-inline: 0;
		bottom: -5px;
		height: 2px;
	}

	:global([data-variant='line'][data-orientation='vertical'])
		> [data-slot='tabs-indicator']::after {
		inset-block: 0;
		right: -4px;
		width: 2px;
	}

	:global([data-bedrock-motion='reduced']) [data-slot='tabs-indicator'] {
		transition: none !important;
	}

	@media (prefers-reduced-motion: reduce) {
		[data-slot='tabs-indicator'] {
			transition: none !important;
		}
	}

	:global([data-bedrock-indicator] [data-slot='tabs-trigger'][data-state='active']) {
		background-color: transparent;
		border-color: transparent;
		box-shadow: none;
	}

	:global([data-bedrock-indicator] [data-slot='tabs-trigger']::after) {
		opacity: 0;
	}
</style>
