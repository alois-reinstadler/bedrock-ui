<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-day.svelte';
</script>

<script lang="ts">
	import CalendarDay from '#lib/shadcn/ui/calendar/calendar-day.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof CalendarDay> = $props();
</script>

<CalendarDay bind:ref {...props} />
