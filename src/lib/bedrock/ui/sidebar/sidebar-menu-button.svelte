<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-menu-button.svelte';
</script>

<script lang="ts">
	import SidebarMenuButton from '#lib/shadcn/ui/sidebar/sidebar-menu-button.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SidebarMenuButton> = $props();
</script>

<SidebarMenuButton {...props} />
