<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-group.svelte';
</script>

<script lang="ts">
	import MenubarGroup from '#lib/shadcn/ui/menubar/menubar-group.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof MenubarGroup> = $props();
</script>

<MenubarGroup bind:ref {...props} />
