<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-checkbox-item.svelte';
</script>

<script lang="ts">
	import DropdownMenuCheckboxItem from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-checkbox-item.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DropdownMenuCheckboxItem> = $props();
</script>

<DropdownMenuCheckboxItem {...props} />
