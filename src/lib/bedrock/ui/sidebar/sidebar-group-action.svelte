<script lang="ts" module>
	export * from '#lib/shadcn/ui/sidebar/sidebar-group-action.svelte';
</script>

<script lang="ts">
	import SidebarGroupAction from '#lib/shadcn/ui/sidebar/sidebar-group-action.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof SidebarGroupAction> = $props();
</script>

<SidebarGroupAction {...props} />
