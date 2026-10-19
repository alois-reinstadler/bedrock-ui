<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar-grid.svelte';
</script>

<script lang="ts">
	import RangeCalendarGrid from '#lib/shadcn/ui/range-calendar/range-calendar-grid.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof RangeCalendarGrid> = $props();
</script>

<RangeCalendarGrid bind:ref {...props} />
