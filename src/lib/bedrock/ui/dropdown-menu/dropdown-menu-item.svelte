<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-item.svelte';
</script>

<script lang="ts">
	import DropdownMenuItem from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-item.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DropdownMenuItem> = $props();
</script>

<DropdownMenuItem {...props} />
