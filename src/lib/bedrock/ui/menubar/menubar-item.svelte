<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-item.svelte';
</script>

<script lang="ts">
	import MenubarItem from '#lib/shadcn/ui/menubar/menubar-item.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof MenubarItem> = $props();
</script>

<MenubarItem bind:ref {...props} />
