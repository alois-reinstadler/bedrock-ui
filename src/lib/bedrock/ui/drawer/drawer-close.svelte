<script lang="ts" module>
	export * from '#lib/shadcn/ui/drawer/drawer-close.svelte';
</script>

<script lang="ts">
	import DrawerClose from '#lib/shadcn/ui/drawer/drawer-close.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DrawerClose> = $props();
</script>

<DrawerClose {...props} />
