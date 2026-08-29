<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-menu-item.svelte';
</script>

<script lang="ts">
	import SidebarMenuItem from '#lib/shadcn/ui/sidebar/sidebar-menu-item.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SidebarMenuItem> = $props();
</script>

<SidebarMenuItem {...props} />
