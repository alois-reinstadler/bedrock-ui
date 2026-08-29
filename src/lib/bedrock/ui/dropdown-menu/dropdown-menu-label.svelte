<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-label.svelte';
</script>

<script lang="ts">
	import DropdownMenuLabel from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-label.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DropdownMenuLabel> = $props();
</script>

<DropdownMenuLabel {...props} />
