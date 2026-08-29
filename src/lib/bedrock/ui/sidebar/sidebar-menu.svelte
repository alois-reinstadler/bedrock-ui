<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-menu.svelte';
</script>

<script lang="ts">
	import SidebarMenu from '#lib/shadcn/ui/sidebar/sidebar-menu.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SidebarMenu> = $props();
</script>

<SidebarMenu {...props} />
