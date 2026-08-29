<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-year-select.svelte';
</script>

<script lang="ts">
	import CalendarYearSelect from '#lib/shadcn/ui/calendar/calendar-year-select.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CalendarYearSelect> = $props();
</script>

<CalendarYearSelect {...props} />
