<script lang="ts" module>
	export * from '#lib/shadcn/ui/navigation-menu/navigation-menu-link.svelte';
</script>

<script lang="ts">
	import NavigationMenuLink from '#lib/shadcn/ui/navigation-menu/navigation-menu-link.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof NavigationMenuLink> = $props();
</script>

<NavigationMenuLink {...props} />
