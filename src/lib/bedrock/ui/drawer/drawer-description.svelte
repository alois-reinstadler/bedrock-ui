<script lang="ts" module>
	export * from '#lib/shadcn/ui/drawer/drawer-description.svelte';
</script>

<script lang="ts">
	import DrawerDescription from '#lib/shadcn/ui/drawer/drawer-description.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DrawerDescription> = $props();
</script>

<DrawerDescription {...props} />
