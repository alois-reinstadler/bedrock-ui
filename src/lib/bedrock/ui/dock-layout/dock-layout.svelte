<script lang="ts" module>
	import type { ComponentProps } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { WithElementRef } from '#lib/utils.js';
	import { HorizonLayout } from 'horizon-layout';

	export type DockLayoutProps = Omit<WithElementRef<HTMLAttributes<HTMLDivElement>>, 'children'> &
		Pick<
			ComponentProps<typeof HorizonLayout>,
			| 'config'
			| 'views'
			| 'tabgroupControls'
			| 'disableResizeSplits'
			| 'disableDragAndDrop'
			| 'showSplitRatio'
			| 'minWidthRatio'
			| 'minHeightRatio'
			| 'maxDepth'
			| 'keyboardControls'
		> & {
			/** Accessible name for the workspace. */
			label: string;
		};
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import { cn } from '#lib/utils.js';
	import './dock-layout.css';

	let {
		ref = $bindable(null),
		class: className,
		label,
		config = $bindable(),
		views,
		tabgroupControls,
		disableResizeSplits,
		disableDragAndDrop,
		showSplitRatio,
		minWidthRatio,
		minHeightRatio,
		maxDepth,
		keyboardControls,
		...restProps
	}: DockLayoutProps = $props();
	const percent = new Intl.NumberFormat('de-AT', { style: 'percent', maximumFractionDigits: 1 });
</script>

<div
	{@attach (element) => {
		if (untrack(() => ref) !== element) ref = element;
		return () => {
			ref = null;
		};
	}}
	data-slot="dock-layout"
	class={cn(
		'h-96 min-h-0 min-w-0 overflow-hidden rounded-lg border bg-background text-foreground',
		className
	)}
	{...restProps}
	role="region"
	aria-label={label}
>
	<HorizonLayout
		bind:config
		{views}
		{tabgroupControls}
		{disableResizeSplits}
		{disableDragAndDrop}
		{showSplitRatio}
		{minWidthRatio}
		{minHeightRatio}
		{maxDepth}
		{keyboardControls}
		baseClass="bedrock-dock-layout"
		formatRatio={(ratio) => percent.format(ratio)}
	/>
</div>
