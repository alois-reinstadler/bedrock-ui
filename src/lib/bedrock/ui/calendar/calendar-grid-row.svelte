<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-grid-row.svelte';
</script>

<script lang="ts">
	import CalendarGridRow from '#lib/shadcn/ui/calendar/calendar-grid-row.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof CalendarGridRow> = $props();
</script>

<CalendarGridRow bind:ref {...props} />
