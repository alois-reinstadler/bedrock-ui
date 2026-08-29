<script lang="ts" module>
	export * from '#lib/shadcn/ui/navigation-menu/navigation-menu-content.svelte';
</script>

<script lang="ts">
	import NavigationMenuContent from '#lib/shadcn/ui/navigation-menu/navigation-menu-content.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof NavigationMenuContent> = $props();
</script>

<NavigationMenuContent {...props} />
