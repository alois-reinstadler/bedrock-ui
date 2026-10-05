<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-cell.svelte';
</script>

<script lang="ts">
	import CalendarCell from '#lib/shadcn/ui/calendar/calendar-cell.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof CalendarCell> = $props();
</script>

<CalendarCell bind:ref {...props} />
