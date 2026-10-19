<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-group-label.svelte';
</script>

<script lang="ts">
	import SidebarGroupLabel from '#lib/shadcn/ui/sidebar/sidebar-group-label.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof SidebarGroupLabel> = $props();
</script>

<SidebarGroupLabel bind:ref {...props} />
