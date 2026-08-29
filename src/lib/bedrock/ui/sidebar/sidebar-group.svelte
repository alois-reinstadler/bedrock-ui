<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-group.svelte';
</script>

<script lang="ts">
	import SidebarGroup from '#lib/shadcn/ui/sidebar/sidebar-group.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SidebarGroup> = $props();
</script>

<SidebarGroup {...props} />
