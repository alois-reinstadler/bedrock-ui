<script lang="ts" module>
	export * from '#lib/shadcn/ui/command/command-input.svelte';
</script>

<script lang="ts">
	import CommandInput from '#lib/shadcn/ui/command/command-input.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		value = $bindable(''),
		...props
	}: ComponentProps<typeof CommandInput> = $props();
</script>

<CommandInput bind:ref bind:value {...props} />
