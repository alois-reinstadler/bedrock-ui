<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-menu-sub.svelte';
</script>

<script lang="ts">
	import SidebarMenuSub from '#lib/shadcn/ui/sidebar/sidebar-menu-sub.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SidebarMenuSub> = $props();
</script>

<SidebarMenuSub {...props} />
