<script lang="ts" module>
	export * from '#lib/shadcn/ui/native-select/native-select-opt-group.svelte';
</script>

<script lang="ts">
	import NativeSelectOptGroup from '#lib/shadcn/ui/native-select/native-select-opt-group.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof NativeSelectOptGroup> = $props();
</script>

<NativeSelectOptGroup {...props} />
