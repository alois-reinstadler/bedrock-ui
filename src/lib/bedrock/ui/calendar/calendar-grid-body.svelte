<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-grid-body.svelte';
</script>

<script lang="ts">
	import CalendarGridBody from '#lib/shadcn/ui/calendar/calendar-grid-body.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof CalendarGridBody> = $props();
</script>

<CalendarGridBody {...props} />
