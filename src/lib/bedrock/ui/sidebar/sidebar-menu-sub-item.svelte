<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-menu-sub-item.svelte';
</script>

<script lang="ts">
	import SidebarMenuSubItem from '#lib/shadcn/ui/sidebar/sidebar-menu-sub-item.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SidebarMenuSubItem> = $props();
</script>

<SidebarMenuSubItem {...props} />
