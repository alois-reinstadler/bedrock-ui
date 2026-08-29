<script lang="ts" module>
	export * from '#lib/shadcn/ui/navigation-menu/navigation-menu.svelte';
</script>

<script lang="ts">
	import NavigationMenu from '#lib/shadcn/ui/navigation-menu/navigation-menu.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof NavigationMenu> = $props();
</script>

<NavigationMenu {...props} />
