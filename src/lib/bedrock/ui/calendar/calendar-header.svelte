<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-header.svelte';
</script>

<script lang="ts">
	import CalendarHeader from '#lib/shadcn/ui/calendar/calendar-header.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof CalendarHeader> = $props();
</script>

<CalendarHeader bind:ref {...props} />
