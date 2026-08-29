<script lang="ts" module>
	export * from '#lib/shadcn/ui/chart/chart-container.svelte';
</script>

<script lang="ts">
	import ChartContainer from '#lib/shadcn/ui/chart/chart-container.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ChartContainer> = $props();
</script>

<ChartContainer {...props} />
