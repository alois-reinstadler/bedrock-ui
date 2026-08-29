<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-group-heading.svelte';
</script>

<script lang="ts">
	import DropdownMenuGroupHeading from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-group-heading.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DropdownMenuGroupHeading> = $props();
</script>

<DropdownMenuGroupHeading {...props} />
