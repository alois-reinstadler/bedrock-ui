<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar.svelte';
</script>

<script lang="ts">
	import Sidebar from '#lib/shadcn/ui/sidebar/sidebar.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof Sidebar> = $props();
</script>

<Sidebar {...props} />

<style>
	:global([data-slot='sidebar-gap']),
	:global([data-slot='sidebar-container']) {
		transition-duration: var(--motion-reveal);
		transition-timing-function: var(--motion-ease-move);
	}
</style>
