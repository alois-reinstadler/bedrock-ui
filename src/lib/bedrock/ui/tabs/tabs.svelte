<script lang="ts" module>
	export * from '#lib/shadcn/ui/tabs/tabs.svelte';
</script>

<script lang="ts">
	import Tabs from '#lib/shadcn/ui/tabs/tabs.svelte';
	import type { ComponentProps } from 'svelte';
	import { panelChange, type PanelMotion } from '#lib/bedrock/motion/panel-change.js';

	let {
		ref = $bindable(null),
		motion = 'none',
		value = $bindable(''),
		...restProps
	}: ComponentProps<typeof Tabs> & {
		/** Optional whole-panel entry on explicit changes; initial content stays visible. */
		motion?: PanelMotion;
	} = $props();
	const attachPanel = panelChange(
		() => ({ key: value, motion }),
		'[data-slot="tabs-content"][data-state="active"]'
	);
</script>

<Tabs {@attach attachPanel} data-panel-motion={motion} bind:ref bind:value {...restProps} />
