<script lang="ts" module>
	export * from '#lib/shadcn/ui/form/form-legend.svelte';
</script>

<script lang="ts">
	import FormLegend from '#lib/shadcn/ui/form/form-legend.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof FormLegend> = $props();
</script>

<FormLegend bind:ref {...props} />
