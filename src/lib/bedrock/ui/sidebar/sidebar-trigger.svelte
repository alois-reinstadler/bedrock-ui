<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-trigger.svelte';
</script>

<script lang="ts">
	import SidebarTrigger from '#lib/shadcn/ui/sidebar/sidebar-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof SidebarTrigger> = $props();
</script>

<SidebarTrigger bind:ref {...props} />
