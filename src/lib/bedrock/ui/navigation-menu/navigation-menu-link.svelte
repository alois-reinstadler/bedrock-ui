<script lang="ts" module>
	export * from '#lib/shadcn/ui/navigation-menu/navigation-menu-link.svelte';
</script>

<script lang="ts">
	import NavigationMenuLink from '#lib/shadcn/ui/navigation-menu/navigation-menu-link.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof NavigationMenuLink> = $props();
</script>

<NavigationMenuLink bind:ref {...props} />
