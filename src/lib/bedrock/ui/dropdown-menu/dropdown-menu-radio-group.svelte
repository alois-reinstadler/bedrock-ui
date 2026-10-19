<script lang="ts" module>
	export * from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-radio-group.svelte';
</script>

<script lang="ts">
	import DropdownMenuRadioGroup from '#lib/shadcn/ui/dropdown-menu/dropdown-menu-radio-group.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		value = $bindable(),
		...props
	}: ComponentProps<typeof DropdownMenuRadioGroup> = $props();
</script>

<DropdownMenuRadioGroup bind:ref bind:value {...props} />
