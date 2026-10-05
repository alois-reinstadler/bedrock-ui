<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-menu-item.svelte';
</script>

<script lang="ts">
	import SidebarMenuItem from '#lib/shadcn/ui/sidebar/sidebar-menu-item.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof SidebarMenuItem> = $props();
</script>

<SidebarMenuItem bind:ref {...props} />
