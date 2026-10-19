<script lang="ts" module>
	export * from '#lib/shadcn/ui/drawer/drawer-header.svelte';
</script>

<script lang="ts">
	import DrawerHeader from '#lib/shadcn/ui/drawer/drawer-header.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof DrawerHeader> = $props();
</script>

<DrawerHeader bind:ref {...props} />
