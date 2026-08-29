<script lang="ts" module>
	export * from '#lib/shadcn/ui/native-select/native-select.svelte';
</script>

<script lang="ts">
	import NativeSelect from '#lib/shadcn/ui/native-select/native-select.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof NativeSelect> = $props();
</script>

<NativeSelect {...props} />
