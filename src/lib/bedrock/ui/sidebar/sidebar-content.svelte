<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-content.svelte';
</script>

<script lang="ts">
	import SidebarContent from '#lib/shadcn/ui/sidebar/sidebar-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SidebarContent> = $props();
</script>

<SidebarContent {...props} />
