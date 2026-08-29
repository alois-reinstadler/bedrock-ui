<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-radio-group.svelte';
</script>

<script lang="ts">
	import DropdownMenuRadioGroup from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-radio-group.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof DropdownMenuRadioGroup> = $props();
</script>

<DropdownMenuRadioGroup {...props} />
