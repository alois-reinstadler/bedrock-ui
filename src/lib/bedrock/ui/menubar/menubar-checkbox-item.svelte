<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-checkbox-item.svelte';
</script>

<script lang="ts">
	import MenubarCheckboxItem from '#lib/shadcn/ui/menubar/menubar-checkbox-item.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		checked = $bindable(false),
		indeterminate = $bindable(false),
		...props
	}: ComponentProps<typeof MenubarCheckboxItem> = $props();
</script>

<MenubarCheckboxItem bind:ref bind:checked bind:indeterminate {...props} />
