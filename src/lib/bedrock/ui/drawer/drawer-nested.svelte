<script lang="ts" module>
	export * from '#lib/shadcn/ui/drawer/drawer-nested.svelte';
</script>

<script lang="ts">
	import DrawerNested from '#lib/shadcn/ui/drawer/drawer-nested.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		open = $bindable(false),
		activeSnapPoint = $bindable(null),
		...props
	}: ComponentProps<typeof DrawerNested> = $props();
</script>

<DrawerNested bind:open bind:activeSnapPoint {...props} />
