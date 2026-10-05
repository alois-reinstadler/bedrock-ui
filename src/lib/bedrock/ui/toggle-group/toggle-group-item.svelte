<script lang="ts" module>
	export * from '#lib/shadcn/ui/toggle-group/toggle-group-item.svelte';
</script>

<script lang="ts">
	import ToggleGroupItem from '#lib/shadcn/ui/toggle-group/toggle-group-item.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		value = $bindable(),
		...props
	}: ComponentProps<typeof ToggleGroupItem> = $props();
</script>

<ToggleGroupItem bind:ref bind:value {...props} />
