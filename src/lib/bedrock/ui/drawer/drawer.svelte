<script lang="ts" module>
	export * from '#lib/shadcn/ui/drawer/drawer.svelte';
</script>

<script lang="ts">
	import Drawer from '#lib/shadcn/ui/drawer/drawer.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		open = $bindable(false),
		activeSnapPoint = $bindable(null),
		...props
	}: ComponentProps<typeof Drawer> = $props();
</script>

<Drawer bind:open bind:activeSnapPoint {...props} />
