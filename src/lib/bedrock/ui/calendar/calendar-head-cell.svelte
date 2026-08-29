<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-head-cell.svelte';
</script>

<script lang="ts">
	import CalendarHeadCell from '#lib/shadcn/ui/calendar/calendar-head-cell.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CalendarHeadCell> = $props();
</script>

<CalendarHeadCell {...props} />
