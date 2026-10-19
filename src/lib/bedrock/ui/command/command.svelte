<script lang="ts" module>
	export * from '#lib/shadcn/ui/command/command.svelte';
</script>

<script lang="ts">
	import Command from '#lib/shadcn/ui/command/command.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		api = $bindable(null),
		ref = $bindable(null),
		value = $bindable(''),
		...props
	}: ComponentProps<typeof Command> = $props();
</script>

<Command bind:api bind:ref bind:value {...props} />
