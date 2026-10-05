<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-year-select.svelte';
</script>

<script lang="ts">
	import CalendarYearSelect from '#lib/shadcn/ui/calendar/calendar-year-select.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof CalendarYearSelect> = $props();
</script>

<CalendarYearSelect bind:ref {...props} />
