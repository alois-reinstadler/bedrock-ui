<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-group-label.svelte';
</script>

<script lang="ts">
	import SidebarGroupLabel from '#lib/shadcn/ui/sidebar/sidebar-group-label.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SidebarGroupLabel> = $props();
</script>

<SidebarGroupLabel {...props} />
