<script lang="ts" module>
	export * from '#lib/shadcn/ui/field/field-separator.svelte';
</script>

<script lang="ts">
	import FieldSeparator from '#lib/shadcn/ui/field/field-separator.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof FieldSeparator> = $props();
</script>

<FieldSeparator bind:ref {...props} />
