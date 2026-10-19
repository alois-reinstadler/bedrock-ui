<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-footer.svelte';
</script>

<script lang="ts">
	import SidebarFooter from '#lib/shadcn/ui/sidebar/sidebar-footer.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof SidebarFooter> = $props();
</script>

<SidebarFooter bind:ref {...props} />
