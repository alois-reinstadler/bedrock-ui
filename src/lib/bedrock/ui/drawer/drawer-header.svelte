<script lang="ts" module>
	export * from '#lib/shadcn/ui/drawer/drawer-header.svelte';
</script>

<script lang="ts">
	import DrawerHeader from '#lib/shadcn/ui/drawer/drawer-header.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DrawerHeader> = $props();
</script>

<DrawerHeader {...props} />
