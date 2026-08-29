<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-grid.svelte';
</script>

<script lang="ts">
	import CalendarGrid from '#lib/shadcn/ui/calendar/calendar-grid.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CalendarGrid> = $props();
</script>

<CalendarGrid {...props} />
