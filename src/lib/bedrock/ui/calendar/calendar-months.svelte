<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-months.svelte';
</script>

<script lang="ts">
	import CalendarMonths from '#lib/shadcn/ui/calendar/calendar-months.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CalendarMonths> = $props();
</script>

<CalendarMonths {...props} />
