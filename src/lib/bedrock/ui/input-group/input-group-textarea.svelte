<script lang="ts" module>
	export * from '#lib/shadcn/ui/input-group/input-group-textarea.svelte';
</script>

<script lang="ts">
	import InputGroupTextarea from '#lib/shadcn/ui/input-group/input-group-textarea.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		value = $bindable(),
		...props
	}: ComponentProps<typeof InputGroupTextarea> = $props();
</script>

<InputGroupTextarea bind:ref bind:value {...props} />
