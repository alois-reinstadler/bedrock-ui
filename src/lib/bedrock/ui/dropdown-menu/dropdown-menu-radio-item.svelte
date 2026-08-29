<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-radio-item.svelte';
</script>

<script lang="ts">
	import DropdownMenuRadioItem from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-radio-item.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DropdownMenuRadioItem> = $props();
</script>

<DropdownMenuRadioItem {...props} />
