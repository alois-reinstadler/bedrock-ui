<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-menu-action.svelte';
</script>

<script lang="ts">
	import SidebarMenuAction from '#lib/shadcn/ui/sidebar/sidebar-menu-action.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SidebarMenuAction> = $props();
</script>

<SidebarMenuAction {...props} />
