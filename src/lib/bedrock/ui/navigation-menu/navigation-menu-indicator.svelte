<script lang="ts" module>
	export * from '#lib/shadcn/ui/navigation-menu/navigation-menu-indicator.svelte';
</script>

<script lang="ts">
	import NavigationMenuIndicator from '#lib/shadcn/ui/navigation-menu/navigation-menu-indicator.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof NavigationMenuIndicator> = $props();
</script>

<NavigationMenuIndicator {...props} />
