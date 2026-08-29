<script lang="ts" module>
	export * from '#lib/shadcn/ui/drawer/drawer-portal.svelte';
</script>

<script lang="ts">
	import DrawerPortal from '#lib/shadcn/ui/drawer/drawer-portal.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DrawerPortal> = $props();
</script>

<DrawerPortal {...props} />
