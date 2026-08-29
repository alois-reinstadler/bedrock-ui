<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-menu-skeleton.svelte';
</script>

<script lang="ts">
	import SidebarMenuSkeleton from '#lib/shadcn/ui/sidebar/sidebar-menu-skeleton.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SidebarMenuSkeleton> = $props();
</script>

<SidebarMenuSkeleton {...props} />
