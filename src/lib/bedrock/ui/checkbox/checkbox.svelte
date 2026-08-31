<script lang="ts" module>
	export * from '#lib/shadcn/ui/checkbox/checkbox.svelte';
</script>

<script lang="ts">
	import Checkbox from '#lib/shadcn/ui/checkbox/checkbox.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		checked = $bindable(false),
		indeterminate = $bindable(false),
		...restProps
	}: ComponentProps<typeof Checkbox> = $props();
</script>

<Checkbox bind:ref bind:checked bind:indeterminate {...restProps} />
