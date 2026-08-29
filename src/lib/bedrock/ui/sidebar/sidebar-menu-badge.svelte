<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-menu-badge.svelte';
</script>

<script lang="ts">
	import SidebarMenuBadge from '#lib/shadcn/ui/sidebar/sidebar-menu-badge.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SidebarMenuBadge> = $props();
</script>

<SidebarMenuBadge {...props} />
