<script lang="ts" module>
	export * from '#lib/shadcn/ui/chart/chart-style.svelte';
</script>

<script lang="ts">
	import ChartStyle from '#lib/shadcn/ui/chart/chart-style.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof ChartStyle> = $props();
</script>

<ChartStyle {...props} />
