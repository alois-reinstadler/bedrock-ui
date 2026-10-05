<script lang="ts" module>
	export * from '#lib/shadcn/ui/navigation-menu/navigation-menu-item.svelte';
</script>

<script lang="ts">
	import NavigationMenuItem from '#lib/shadcn/ui/navigation-menu/navigation-menu-item.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof NavigationMenuItem> = $props();
</script>

<NavigationMenuItem bind:ref {...props} />
