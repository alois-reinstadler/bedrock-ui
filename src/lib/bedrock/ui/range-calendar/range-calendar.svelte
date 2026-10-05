<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar.svelte';
</script>

<script lang="ts">
	import RangeCalendar from '#lib/shadcn/ui/range-calendar/range-calendar.svelte';
	import type { ComponentProps } from 'svelte';
	import { panelChange, type PanelMotion } from '#lib/bedrock/motion/panel-change.js';

	let {
		ref = $bindable(null),
		motion = 'none',
		value = $bindable(),
		placeholder = $bindable(),
		...props
	}: ComponentProps<typeof RangeCalendar> & {
		/** Optional whole-panel entry on explicit changes; initial content stays visible. */
		motion?: PanelMotion;
	} = $props();
	const attachPanel = panelChange(
		() => ({ key: placeholder ? `${placeholder.year}-${placeholder.month}` : '', motion }),
		'[role="grid"]'
	);
</script>

<RangeCalendar
	{@attach attachPanel}
	data-panel-motion={motion}
	bind:ref
	bind:value
	bind:placeholder
	{...props}
/>
