<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-provider.svelte';
</script>

<script lang="ts">
	import SidebarProvider from '#lib/shadcn/ui/sidebar/sidebar-provider.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SidebarProvider> = $props();
</script>

<SidebarProvider {...props} />
