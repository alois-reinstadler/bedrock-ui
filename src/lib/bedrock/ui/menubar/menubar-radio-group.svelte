<script lang="ts" module>
	export * from '#lib/shadcn/ui/menubar/menubar-radio-group.svelte';
</script>

<script lang="ts">
	import MenubarRadioGroup from '#lib/shadcn/ui/menubar/menubar-radio-group.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		value = $bindable(''),
		...props
	}: ComponentProps<typeof MenubarRadioGroup> = $props();
</script>

<MenubarRadioGroup bind:ref bind:value {...props} />
