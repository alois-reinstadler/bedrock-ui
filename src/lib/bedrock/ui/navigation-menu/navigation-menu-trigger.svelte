<script lang="ts" module>
	export * from '#lib/shadcn/ui/navigation-menu/navigation-menu-trigger.svelte';
</script>

<script lang="ts">
	import NavigationMenuTrigger from '#lib/shadcn/ui/navigation-menu/navigation-menu-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof NavigationMenuTrigger> = $props();
</script>

<NavigationMenuTrigger bind:ref {...props} />
