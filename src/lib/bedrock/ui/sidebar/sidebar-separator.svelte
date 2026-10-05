<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-separator.svelte';
</script>

<script lang="ts">
	import SidebarSeparator from '#lib/shadcn/ui/sidebar/sidebar-separator.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof SidebarSeparator> = $props();
</script>

<SidebarSeparator bind:ref {...props} />
