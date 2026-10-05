<script lang="ts" module>
	export * from '#lib/shadcn/ui/input-group/input-group-input.svelte';
</script>

<script lang="ts">
	import InputGroupInput from '#lib/shadcn/ui/input-group/input-group-input.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		value = $bindable(),
		...props
	}: ComponentProps<typeof InputGroupInput> = $props();
</script>

<InputGroupInput bind:ref bind:value {...props} />
