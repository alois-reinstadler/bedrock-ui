<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-trigger.svelte';
</script>

<script lang="ts">
	import SidebarTrigger from '#lib/shadcn/ui/sidebar/sidebar-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SidebarTrigger> = $props();
</script>

<SidebarTrigger {...props} />
