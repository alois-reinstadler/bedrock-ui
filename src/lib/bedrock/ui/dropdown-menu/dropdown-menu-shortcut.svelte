<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-shortcut.svelte';
</script>

<script lang="ts">
	import DropdownMenuShortcut from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-shortcut.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof DropdownMenuShortcut> = $props();
</script>

<DropdownMenuShortcut bind:ref {...props} />
