<script lang="ts" module>
	export * from '#lib/shadcn/ui/field/field-legend.svelte';
</script>

<script lang="ts">
	import FieldLegend from '#lib/shadcn/ui/field/field-legend.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof FieldLegend> = $props();
</script>

<FieldLegend bind:ref {...props} />
