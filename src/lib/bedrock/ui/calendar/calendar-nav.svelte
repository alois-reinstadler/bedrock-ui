<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-nav.svelte';
</script>

<script lang="ts">
	import CalendarNav from '#lib/shadcn/ui/calendar/calendar-nav.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof CalendarNav> = $props();
</script>

<CalendarNav bind:ref {...props} />
