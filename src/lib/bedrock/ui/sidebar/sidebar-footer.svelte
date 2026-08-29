<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-footer.svelte';
</script>

<script lang="ts">
	import SidebarFooter from '#lib/shadcn/ui/sidebar/sidebar-footer.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SidebarFooter> = $props();
</script>

<SidebarFooter {...props} />
