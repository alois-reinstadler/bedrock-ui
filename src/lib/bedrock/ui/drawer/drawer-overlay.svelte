<script lang="ts" module>
	export * from '#lib/shadcn/ui/drawer/drawer-overlay.svelte';
</script>

<script lang="ts">
	import DrawerOverlay from '#lib/shadcn/ui/drawer/drawer-overlay.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DrawerOverlay> = $props();
</script>

<DrawerOverlay {...props} />
