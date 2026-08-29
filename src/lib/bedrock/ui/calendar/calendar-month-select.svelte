<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-month-select.svelte';
</script>

<script lang="ts">
	import CalendarMonthSelect from '#lib/shadcn/ui/calendar/calendar-month-select.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CalendarMonthSelect> = $props();
</script>

<CalendarMonthSelect {...props} />
