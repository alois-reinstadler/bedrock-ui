<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-shortcut.svelte';
</script>

<script lang="ts">
	import MenubarShortcut from '#lib/shadcn/ui/menubar/menubar-shortcut.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof MenubarShortcut> = $props();
</script>

<MenubarShortcut bind:ref {...props} />
