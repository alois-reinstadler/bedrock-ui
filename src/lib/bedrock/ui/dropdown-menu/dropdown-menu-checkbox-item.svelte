<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-checkbox-item.svelte';
</script>

<script lang="ts">
	import DropdownMenuCheckboxItem from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-checkbox-item.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		checked = $bindable(false),
		indeterminate = $bindable(false),
		...props
	}: ComponentProps<typeof DropdownMenuCheckboxItem> = $props();
</script>

<DropdownMenuCheckboxItem bind:ref bind:checked bind:indeterminate {...props} />
