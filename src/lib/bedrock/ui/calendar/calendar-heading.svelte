<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-heading.svelte';
</script>

<script lang="ts">
	import CalendarHeading from '#lib/shadcn/ui/calendar/calendar-heading.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof CalendarHeading> = $props();
</script>

<CalendarHeading bind:ref {...props} />
