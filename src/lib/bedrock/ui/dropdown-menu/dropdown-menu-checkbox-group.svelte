<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-checkbox-group.svelte';
</script>

<script lang="ts">
	import DropdownMenuCheckboxGroup from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-checkbox-group.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DropdownMenuCheckboxGroup> = $props();
</script>

<DropdownMenuCheckboxGroup {...props} />
