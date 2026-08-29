<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-rail.svelte';
</script>

<script lang="ts">
	import SidebarRail from '#lib/shadcn/ui/sidebar/sidebar-rail.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SidebarRail> = $props();
</script>

<SidebarRail {...props} />
