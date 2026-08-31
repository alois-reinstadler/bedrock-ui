<script lang="ts" module>
	export * from '#lib/shadcn/ui/select/select.svelte';
</script>

<script lang="ts">
	import Select from '#lib/shadcn/ui/select/select.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		open = $bindable(false),
		value = $bindable(),
		...restProps
	}: ComponentProps<typeof Select> = $props();
</script>

<Select bind:open bind:value={value as never} {...restProps} />
