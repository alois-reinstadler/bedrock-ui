<script lang="ts" module>
	export * from '#lib/shadcn/ui/navigation-menu/navigation-menu-list.svelte';
</script>

<script lang="ts">
	import NavigationMenuList from '#lib/shadcn/ui/navigation-menu/navigation-menu-list.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof NavigationMenuList> = $props();
</script>

<NavigationMenuList {...props} />
