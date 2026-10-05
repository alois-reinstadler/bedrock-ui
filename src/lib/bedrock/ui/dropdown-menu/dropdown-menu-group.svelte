<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-group.svelte';
</script>

<script lang="ts">
	import DropdownMenuGroup from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-group.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof DropdownMenuGroup> = $props();
</script>

<DropdownMenuGroup bind:ref {...props} />
