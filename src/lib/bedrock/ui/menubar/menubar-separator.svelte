<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-separator.svelte';
</script>

<script lang="ts">
	import MenubarSeparator from '#lib/shadcn/ui/menubar/menubar-separator.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof MenubarSeparator> = $props();
</script>

<MenubarSeparator bind:ref {...props} />
