<script lang="ts" module>
	export * from '#lib/shadcn/ui/range-calendar/range-calendar-year-select.svelte';
</script>

<script lang="ts">
	import RangeCalendarYearSelect from '#lib/shadcn/ui/range-calendar/range-calendar-year-select.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof RangeCalendarYearSelect> = $props();
</script>

<RangeCalendarYearSelect {...props} />
