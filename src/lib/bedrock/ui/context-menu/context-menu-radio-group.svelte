<script lang="ts" module>
	export * from '#lib/shadcn/ui/context-menu/context-menu-radio-group.svelte';
</script>

<script lang="ts">
	import ContextMenuRadioGroup from '#lib/shadcn/ui/context-menu/context-menu-radio-group.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		value = $bindable(''),
		...props
	}: ComponentProps<typeof ContextMenuRadioGroup> = $props();
</script>

<ContextMenuRadioGroup bind:ref bind:value {...props} />
