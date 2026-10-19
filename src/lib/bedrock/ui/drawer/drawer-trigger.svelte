<script lang="ts" module>
	export * from '#lib/shadcn/ui/drawer/drawer-trigger.svelte';
</script>

<script lang="ts">
	import DrawerTrigger from '#lib/shadcn/ui/drawer/drawer-trigger.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof DrawerTrigger> = $props();
</script>

<DrawerTrigger bind:ref {...props} />
