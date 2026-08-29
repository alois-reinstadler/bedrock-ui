<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar-months.svelte';
</script>

<script lang="ts">
	import RangeCalendarMonths from '#lib/shadcn/ui/range-calendar/range-calendar-months.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof RangeCalendarMonths> = $props();
</script>

<RangeCalendarMonths {...props} />
