<script lang="ts" module>
	export * from '#lib/shadcn/ui/chart/chart-tooltip.svelte';
</script>

<script lang="ts">
	import ChartTooltip from '#lib/shadcn/ui/chart/chart-tooltip.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof ChartTooltip> = $props();
</script>

<ChartTooltip bind:ref {...props} />
