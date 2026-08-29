<script lang="ts" module>
	export * from '#lib/shadcn/ui/navigation-menu/navigation-menu-viewport.svelte';
</script>

<script lang="ts">
	import NavigationMenuViewport from '#lib/shadcn/ui/navigation-menu/navigation-menu-viewport.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof NavigationMenuViewport> = $props();
</script>

<NavigationMenuViewport {...props} />
