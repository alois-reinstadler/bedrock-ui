<script lang="ts" module>
	export * from '#lib/shadcn/ui/native-select/native-select-option.svelte';
</script>

<script lang="ts">
	import NativeSelectOption from '#lib/shadcn/ui/native-select/native-select-option.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof NativeSelectOption> = $props();
</script>

<NativeSelectOption bind:ref {...props} />
