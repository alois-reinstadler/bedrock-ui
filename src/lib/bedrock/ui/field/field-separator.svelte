<script lang="ts" module>
	export * from '#lib/shadcn/ui/field/field-separator.svelte';
</script>

<script lang="ts">
	import FieldSeparator from '#lib/shadcn/ui/field/field-separator.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof FieldSeparator> = $props();
</script>

<FieldSeparator {...props} />
