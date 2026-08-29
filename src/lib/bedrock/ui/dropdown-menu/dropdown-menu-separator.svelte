<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-separator.svelte';
</script>

<script lang="ts">
	import DropdownMenuSeparator from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-separator.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DropdownMenuSeparator> = $props();
</script>

<DropdownMenuSeparator {...props} />
