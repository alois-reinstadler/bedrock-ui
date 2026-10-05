<script lang="ts" module>
	export * from '#lib/shadcn/ui/native-select/native-select.svelte';
</script>

<script lang="ts">
	import NativeSelect from '#lib/shadcn/ui/native-select/native-select.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		value = $bindable(),
		...props
	}: ComponentProps<typeof NativeSelect> = $props();
</script>

<NativeSelect bind:ref bind:value {...props} />
