<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-portal.svelte';
</script>

<script lang="ts">
	import DropdownMenuPortal from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-portal.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DropdownMenuPortal> = $props();
</script>

<DropdownMenuPortal {...props} />
