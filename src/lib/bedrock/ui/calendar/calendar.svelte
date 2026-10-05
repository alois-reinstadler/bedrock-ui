<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar.svelte';
</script>

<script lang="ts">
	import Calendar from '#lib/shadcn/ui/calendar/calendar.svelte';
	import type { ComponentProps } from 'svelte';
	import { panelChange, type PanelMotion } from '#lib/bedrock/motion/panel-change.js';

	let {
		ref = $bindable(null),
		motion = 'none',
		value = $bindable(),
		placeholder = $bindable(),
		...props
	}: ComponentProps<typeof Calendar> & {
		/** Optional whole-panel entry on explicit changes; initial content stays visible. */
		motion?: PanelMotion;
	} = $props();
	const attachPanel = panelChange(
		() => ({ key: placeholder ? `${placeholder.year}-${placeholder.month}` : '', motion }),
		'[role="grid"]'
	);
</script>

<Calendar
	{@attach attachPanel}
	data-panel-motion={motion}
	bind:ref
	bind:value={value as never}
	bind:placeholder
	{...props}
/>
