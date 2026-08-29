<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar-month-select.svelte';
</script>

<script lang="ts">
	import RangeCalendarMonthSelect from '#lib/shadcn/ui/range-calendar/range-calendar-month-select.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof RangeCalendarMonthSelect> = $props();
</script>

<RangeCalendarMonthSelect {...props} />
