<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-day.svelte';
</script>

<script lang="ts">
	import CalendarDay from '#lib/shadcn/ui/calendar/calendar-day.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CalendarDay> = $props();
</script>

<CalendarDay {...props} />
