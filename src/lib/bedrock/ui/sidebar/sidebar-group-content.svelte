<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-group-content.svelte';
</script>

<script lang="ts">
	import SidebarGroupContent from '#lib/shadcn/ui/sidebar/sidebar-group-content.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof SidebarGroupContent> = $props();
</script>

<SidebarGroupContent bind:ref {...props} />
