<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu.svelte';
</script>

<script lang="ts">
	import DropdownMenu from '#lib/shadcn/ui/dropdown-menu/dropdown-menu.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DropdownMenu> = $props();
</script>

<DropdownMenu {...props} />
