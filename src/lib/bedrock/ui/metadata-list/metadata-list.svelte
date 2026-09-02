<script lang="ts" module>
	const defaultLabels = {
		showMore: (n: number) => `Show ${n} more`,
		showLess: 'Show less'
	};

	export type MetadataListLabels = Partial<typeof defaultLabels>;
</script>

<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { setMetadataListContext } from './context.js';

	/**
	 * Key-value pairs for record detail panels. Renders a semantic `<dl>` whose
	 * items are `<div>`-wrapped `<dt>`/`<dd>` groups (valid per the HTML spec).
	 */
	let {
		ref = $bindable(null),
		class: className,
		columns = 1,
		labelPosition = 'start',
		labelWidth,
		maxItems,
		labels: labelOverrides = {},
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDListElement>, HTMLDListElement> & {
		/** `auto` switches to two columns from the `sm` breakpoint up. */
		columns?: 1 | 2 | 'auto';
		/** `start` puts labels in a left column, `top` stacks label over value. */
		labelPosition?: 'start' | 'top';
		/** CSS width for the label column when `labelPosition` is `start`. */
		labelWidth?: string;
		/** Items beyond this count collapse behind a show more/less toggle. */
		maxItems?: number;
		labels?: MetadataListLabels;
		children?: Snippet;
	} = $props();

	const labels = $derived({ ...defaultLabels, ...labelOverrides });

	// Items register at init in source order, so the count is complete by the
	// time the toggle below the children renders — during SSR too.
	let count = $state(0);
	let expanded = $state(false);

	setMetadataListContext({
		register: () => {
			const index = count;
			count += 1;
			return index;
		},
		isCollapsible: (index) => maxItems !== undefined && index >= maxItems,
		isHidden: (index) => maxItems !== undefined && index >= maxItems && !expanded,
		getLabelPosition: () => labelPosition,
		getLabelWidth: () => labelWidth
	});

	const hiddenCount = $derived(maxItems === undefined ? 0 : Math.max(0, count - maxItems));
</script>

<dl
	bind:this={ref}
	data-slot="metadata-list"
	class={cn(
		'text-sm',
		columns === 2 && 'grid grid-cols-2 gap-x-8',
		columns === 'auto' && 'grid gap-x-8 sm:grid-cols-2',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</dl>
{#if maxItems !== undefined && count > maxItems}
	<Button
		type="button"
		variant="ghost"
		size="sm"
		aria-expanded={expanded}
		class="mt-1 text-muted-foreground"
		onclick={() => (expanded = !expanded)}
	>
		{expanded ? labels.showLess : labels.showMore(hiddenCount)}
	</Button>
{/if}
