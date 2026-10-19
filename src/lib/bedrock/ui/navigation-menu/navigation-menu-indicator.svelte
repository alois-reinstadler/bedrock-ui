<script lang="ts" module>
	export * from '#lib/shadcn/ui/navigation-menu/navigation-menu-indicator.svelte';
</script>

<script lang="ts">
	import NavigationMenuIndicator from '#lib/shadcn/ui/navigation-menu/navigation-menu-indicator.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof NavigationMenuIndicator> =
		$props();
</script>

<NavigationMenuIndicator bind:ref {...props} />
