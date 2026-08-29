<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-menu-sub-button.svelte';
</script>

<script lang="ts">
	import SidebarMenuSubButton from '#lib/shadcn/ui/sidebar/sidebar-menu-sub-button.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SidebarMenuSubButton> = $props();
</script>

<SidebarMenuSubButton {...props} />
