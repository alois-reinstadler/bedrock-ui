<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-inset.svelte';
</script>

<script lang="ts">
	import SidebarInset from '#lib/shadcn/ui/sidebar/sidebar-inset.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof SidebarInset> = $props();
</script>

<SidebarInset bind:ref {...props} />
