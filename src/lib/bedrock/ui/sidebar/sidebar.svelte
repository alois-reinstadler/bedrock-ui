<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar.svelte';
</script>

<script lang="ts">
	import SidebarHighlights from './sidebar-highlights.svelte';
	import Sidebar from '#lib/shadcn/ui/sidebar/sidebar.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		children,
		highlights = true,
		...props
	}: ComponentProps<typeof Sidebar> & {
		/** Shared hover and active surfaces across this sidebar. Disable for a custom highlight implementation. */
		highlights?: boolean;
	} = $props();
</script>

<Sidebar bind:ref {...props}>
	{#if highlights}
		<SidebarHighlights>{@render children?.()}</SidebarHighlights>
	{:else}
		{@render children?.()}
	{/if}
</Sidebar>

<style>
	:global([data-slot='sidebar-gap']),
	:global([data-slot='sidebar-container']) {
		transition-duration: var(--motion-reveal);
		transition-timing-function: var(--motion-ease-move);
	}
</style>
