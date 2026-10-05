<script lang="ts" module>
	export * from '#lib/shadcn/ui/input/input.svelte';
</script>

<script lang="ts">
	import Input from '#lib/shadcn/ui/input/input.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		value = $bindable(),
		files = $bindable(),
		...props
	}: ComponentProps<typeof Input> = $props();
</script>

{#if props.type === 'file'}
	<Input {...props} type="file" bind:ref bind:value bind:files />
{:else}
	<Input {...props} bind:ref bind:value />
{/if}
