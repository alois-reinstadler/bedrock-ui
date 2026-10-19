<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-month.svelte';
</script>

<script lang="ts">
	import CalendarMonth from '#lib/shadcn/ui/calendar/calendar-month.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof CalendarMonth> = $props();
</script>

<CalendarMonth bind:ref {...props} />
