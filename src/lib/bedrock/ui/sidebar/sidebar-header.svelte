<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-header.svelte';
</script>

<script lang="ts">
	import SidebarHeader from '#lib/shadcn/ui/sidebar/sidebar-header.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SidebarHeader> = $props();
</script>

<SidebarHeader {...props} />
