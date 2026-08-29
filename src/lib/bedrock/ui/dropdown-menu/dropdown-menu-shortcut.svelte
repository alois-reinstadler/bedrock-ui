<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-shortcut.svelte';
</script>

<script lang="ts">
	import DropdownMenuShortcut from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-shortcut.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DropdownMenuShortcut> = $props();
</script>

<DropdownMenuShortcut {...props} />
