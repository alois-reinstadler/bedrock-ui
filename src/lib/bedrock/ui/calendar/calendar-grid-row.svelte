<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-grid-row.svelte';
</script>

<script lang="ts">
	import CalendarGridRow from '#lib/shadcn/ui/calendar/calendar-grid-row.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CalendarGridRow> = $props();
</script>

<CalendarGridRow {...props} />
